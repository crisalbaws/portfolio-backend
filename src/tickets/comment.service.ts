import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../common/common.service';
import { Repository } from 'typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { ApiResponse } from '../common/response.interface';
import { CommentEntity } from './entities/comment.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Credentials } from '@aws-sdk/types';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(AttachmentEntity)
    private attachmentRepository: Repository<AttachmentEntity>,
    private commonService: CommonService,
    private s3Client: S3Client,
    private configService: ConfigService,
  ) {
    const accessKeyId = this.configService.get<string>('AMAZON_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AMAZON_SECRET_ACCESS_KEY');
    const credentialsProvider: Credentials = {
      accessKeyId,
      secretAccessKey,
    };
    this.s3Client = new S3Client({
      credentials: credentialsProvider,
      region: 'us-east-1', // Cambia esto según tu región de S3
    });
  }

  async findAllCommentsByTicketId(ticketId: string): Promise<ApiResponse> {
    try {
      // Obtener el ticket con todos los comentarios y sus adjuntos relacionados
      const ticketWithRelations = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.comments', 'comment')
        .leftJoinAndSelect('comment.attachments', 'attachment')
        .where('ticket.id = :id', { id: ticketId })
        .getOne();

      if (!ticketWithRelations) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          `Ticket with ID ${ticketId} not found`,
        );
      }

      // Extraer los comentarios asociados al ticket con sus adjuntos
      const comments = ticketWithRelations.comments;

      // Retornar la respuesta exitosa con los comentarios y sus adjuntos relacionados
      return this.commonService.processResponse(comments);
    }
    catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error en el servidor: ${error.message}`,
      );
    }
  }

  async create(createCommentDto: CreateCommentDto[] | CreateCommentDto, ticketId: string): Promise<ApiResponse> {
    try {
      // Verificar si el ticket existe
      const ticket = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.comments', 'comment')
        .leftJoinAndSelect('comment.attachments', 'attachment')
        .where('ticket.id = :id', { id: ticketId })
        .getOne();

      if (!ticket) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          `Ticket with ID ${ticketId} not found`,
        );
      }

      if (Array.isArray(createCommentDto) && createCommentDto.length > 0) {
        for (const itemDto of createCommentDto) {
          await this.createComment(ticket, itemDto);
        }
      } else {
        await this.createComment(ticket, createCommentDto);
      }
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error creating comment: ${error.message}`,
      );
    }
  }

  private async createComment(ticket: TicketEntity, createCommentDto: any) {
    const newComment = new CommentEntity();
    newComment.ticket = ticket;
    const commentSave = Object.assign(newComment, createCommentDto);
    const savedComment = await this.commentRepository.save(newComment);
    if (createCommentDto.attachments && Array.isArray(createCommentDto.attachments)) {
      for (const attachmentInfo of createCommentDto.attachments) {
        const newAttachment = new AttachmentEntity();
        newAttachment.comment = savedComment;
        Object.assign(newAttachment, attachmentInfo);
        await this.attachmentRepository.save(newAttachment);
      }
    }
    createCommentDto.id = commentSave.id;
    return this.commonService.processResponse(createCommentDto);
  }

  async uploadImage(file: any, attachmentId: string, folder: string): Promise<string> {
    const uploadParams: PutObjectCommandInput = {
      Bucket: 'portfolio-caaws-public',
      Key: `images/ryc/${folder}/${attachmentId}-item-${new Date().getTime()}`,
      Body: file.buffer,
      // ACL: 'public-read' // Cambia esto según tus necesidades de permisos
      CacheControl: "max-age=86400",
      ContentDisposition: 'inline',
      ContentType: 'image/jpeg',
    };
    const command = new PutObjectCommand(uploadParams);
    try {
      const result: PutObjectCommandOutput = await this.s3Client.send(command);
      const bucketName = uploadParams.Bucket;
      const objectKey = uploadParams.Key;
      const objectUrl = `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
      return objectUrl; // Devuelve la URL del archivo subido
    } catch (error) {
      console.error('Error al cargar la imagen en S3:', error);
      throw error;
    }
  }

  async deleteImage(url: string): Promise<any> {
    const objectKey = url.substring('https://portfolio-caaws-public.s3.amazonaws.com/'.length);
    const deleteParams = {
      Bucket: 'portfolio-caaws-public',
      Key: objectKey
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    try {
      return await this.s3Client.send(deleteCommand);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, commentDto: UpdateCommentDto, userUpdateId: string): Promise<ApiResponse> {
    try {
      const findComment = await this.commentRepository.findOne(
        {
          where: {
            id,
          }
        },
      );

      if (findComment) {
        const updateComment = Object.assign(findComment, commentDto);
        updateComment.userIdCreated = userUpdateId;;
        this.commentRepository.save(updateComment);
        return this.commonService.processResponse(updateComment, HttpStatus.OK, "Comment guardado correctamente");
      }
      else {
        if (!findComment) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El comment no existe");
      }
    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message)
    }
  }

  async updateAttachment(id: string, url: string): Promise<ApiResponse> {
    try {
      const findAttachment = await this.attachmentRepository.findOne(
        {
          where: {
            id,
          }
        },
      );
      if (findAttachment) {
        findAttachment.uri = url;
        findAttachment.name = (new Date().getTime()).toString();
        findAttachment.id = findAttachment.id;
        this.attachmentRepository.save(findAttachment);
        return this.commonService.processResponse(findAttachment, HttpStatus.OK, "Attachment guardado correctamente");
      }
      else {
        if (!findAttachment) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El comment no existe");
      }
    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message)
    }
  }
  async findOneAttachment(id: string, url: string, name: string): Promise<ApiResponse> {
    try {
      const findAttachment = await this.attachmentRepository.findOne(
        {
          where: {
            id,
          }
        },
      );
      if (findAttachment) {
        return this.commonService.processResponse(findAttachment, HttpStatus.OK, "Se encontro");
      }
      else {
        if (!findAttachment) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "El comment no existe");
      }
    } catch (error) {
      return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message)
    }
  }

}
