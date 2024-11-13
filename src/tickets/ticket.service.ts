import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../common/common.service';
import { In, Repository } from 'typeorm';
import { TicketEntity } from './entities/ticket.entity';
import { TicketCreateRequestDto } from './dto/create-ticket.dto';
import { ApiResponse } from '../common/response.interface';
import { CommentEntity } from './entities/comment.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';
import { TicketStatus } from './tickets-enums';
import { TicketItemEntity } from '../ticket-items/entities/ticket-item.entity';
import { ItemEntity } from '../items/entities/item.entity';
import { TicketCloseRequestDto } from './dto/close-ticket.dto';
import { TicketItemStatus } from '../ticket-items/ticket-items-enums';

@Injectable()
export class TicketService {
  constructor(
    private commonService: CommonService,

    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,

    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,

    @InjectRepository(AttachmentEntity)
    private attachmentRepository: Repository<AttachmentEntity>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,

    @InjectRepository(TicketItemEntity)
    private ticketItemRepository: Repository<TicketItemEntity>,
  ) { }



  async create(createTicketDto: TicketCreateRequestDto): Promise<ApiResponse> {
    try {

      // Verificar que el usuario deudor exista
      const debtor = await this.userRepository.findOne({ where: { id: createTicketDto.customerId } });
      if (!debtor) {
        return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, `Usuario deudor con ID ${createTicketDto.customerId} no encontrado.`);
      }

      const { comments, ...ticketData } = createTicketDto;
      // Crear el ticket principal
      const newTicket = this.ticketRepository.create(ticketData);
      newTicket.creationDate = new Date();
      newTicket.folio = ((newTicket.channel.substring(0, 3)).trim() + (newTicket.customerName.substring(0, 3)).trim() + String(new Date().getTime())).toUpperCase().trim();
      newTicket.customerId = debtor.id;
      await this.ticketRepository.save(newTicket);

      for (const itemDto of createTicketDto.items) {
        const item = await this.itemRepository.findOne({ where: { id: itemDto.id } });
        const ticketItem = this.ticketItemRepository.create({
          ticket: newTicket,
          item: item,
          itemName: item.title,
          itemPrice: item.price,
          quantity: itemDto.quantity,
        });
        await this.ticketItemRepository.save(ticketItem);
      }

      // Procesar cada comentario con sus adjuntos
      if (comments && Array.isArray(comments)) {
        let index = 0;
        for (const commentData of comments) {
          const { attachments, ...commentInfo } = commentData;

          // Crear el comentario asociado al ticket
          const newComment = new CommentEntity();
          newComment.ticket = newTicket;
          Object.assign(newComment, commentInfo);
          await this.commentRepository.save(newComment);
          let attachmentsCreates: any = [];
          if (attachments && Array.isArray(attachments)) {
            for (const attachmentInfo of attachments) {
              const newAttachment = this.attachmentRepository.create({
                name: attachmentInfo.name,
                uri: attachmentInfo.uri,
                comment: newComment,
              });
              const at = await this.attachmentRepository.save(newAttachment);
              attachmentsCreates.push(at);
            }
          }
          createTicketDto.comments[index].attachments = [...attachmentsCreates];
          index++;
        }
      }
      return this.commonService.processResponse(createTicketDto);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }

  async closeTicket(closeTicketDto: TicketCloseRequestDto): Promise<ApiResponse> {
    try {
      const { id, itemsToDelete, itemsToAdd, status, userUpdateId, userUpdateName, price } = closeTicketDto;

      // Encuentra el ticket por ID
      const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['ticketItems'] });
      if (!ticket) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          'Ticket no encontrado',
        );
      }
      ticket.status = status;
      ticket.userUpdateId = userUpdateId;
      ticket.userUpdateName = userUpdateName;
      ticket.price = price;

      await this.ticketRepository.save(ticket);

      if (itemsToDelete && itemsToDelete.length > 0) {
        for (const itemDtoDelete of itemsToDelete) {
          const newItem = await this.ticketItemRepository.findOne({ where: { id: itemDtoDelete.id } })
          newItem.status = TicketItemStatus.Deleted;
          await this.ticketItemRepository.save(newItem);
        }
      }

      if (itemsToAdd && itemsToAdd.length > 0) {
        for (const itemDto of itemsToAdd) {
          const item = await this.itemRepository.findOne({ where: { id: itemDto.id } });
          if (item) {
            const ticketItem = this.ticketItemRepository.create({
              ticket: ticket,
              item: item,
              itemName: item.title,
              itemPrice: item.price,
              quantity: itemDto.quantity,
            });
            await this.ticketItemRepository.save(ticketItem);
          }
        }
      }

      return this.commonService.processResponse(ticket);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }

  async findTicketById(ticketId: string): Promise<ApiResponse> {
    try {
      // Buscar el ticket por su ID junto con comentarios y adjuntos asociados
      const ticket = await this.ticketRepository
        .createQueryBuilder('ticket')
        .leftJoinAndSelect('ticket.comments', 'comment')
        .leftJoinAndSelect('comment.attachments', 'attachment')
        .leftJoinAndSelect('ticket.ticketItems', 'ticket_items', 'ticket_items.status = :status', { status: TicketItemStatus.Active })
        .where('ticket.id = :id', { id: ticketId })
        .getOne();

      if (!ticket) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          `Ticket with ID ${ticketId} not found`,
        );
      }

      return this.commonService.processResponse(ticket);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error retrieving ticket: ${error.message}`,
      );
    }
  }

  async updateStatusTicketById(ticketId: string, status: TicketStatus): Promise<ApiResponse> {
    try {
      // Buscar el ticket por su ID junto con comentarios y adjuntos asociados
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

      // Actualizar el estado del ticket
      ticket.status = status;
      const ticketSaved = await this.ticketRepository.save(ticket);
      return this.commonService.processResponse(ticketSaved);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error updating ticket: ${error.message}`,
      );
    }
  }

  async findAllTicketsWithCommentsAndAttachments(userId: string): Promise<ApiResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })
      if (user.userProfile.id != 1) {
        // Obtener todos los tickets con sus comentarios y adjuntos
        const tickets = await this.ticketRepository
          .createQueryBuilder('ticket')
          .leftJoinAndSelect('ticket.comments', 'comment')
          .leftJoinAndSelect('comment.attachments', 'attachment')
          .where(
            { userCreationId: userId })
          .getMany();
        return this.commonService.processResponse(tickets);
      }
      else {
        // Obtener todos los tickets con sus comentarios y adjuntos
        const tickets = await this.ticketRepository
          .createQueryBuilder('ticket')
          .leftJoinAndSelect('ticket.comments', 'comment')
          .leftJoinAndSelect('comment.attachments', 'attachment')
          .getMany();

        return this.commonService.processResponse(tickets);
      }

    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error en el servidor: ${error.message}`,
      );
    }
  }

  async createComment(createCommentDto: CreateCommentDto, ticketId: string): Promise<ApiResponse> {
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

      // Crear el nuevo comentario asociado al ticket
      const newComment = new CommentEntity();
      newComment.ticket = ticket;
      const commentSave = Object.assign(newComment, createCommentDto);
      const savedComment = await this.commentRepository.save(newComment);

      // Procesar los adjuntos del comentario si existen
      if (createCommentDto.attachments && Array.isArray(createCommentDto.attachments)) {
        for (const attachmentInfo of createCommentDto.attachments) {
          const newAttachment = new AttachmentEntity();
          newAttachment.comment = savedComment; // Asociar el adjunto al comentario creado
          Object.assign(newAttachment, attachmentInfo);
          await this.attachmentRepository.save(newAttachment);
        }
      }
      // Retornar la respuesta exitosa con el comentario creado
      createCommentDto.id = commentSave.id;
      return this.commonService.processResponse(createCommentDto);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error creating comment: ${error.message}`,
      );
    }
  }

  // async findOne(id: number): Promise<ApiResponse> {
  //   try {
  //     const findAppVersion = await this.appVersionRepository.findOne(
  //       {
  //         where: {
  //           id: id
  //         }
  //       }
  //     );
  //     if (findAppVersion) return this.commonService.processResponse(findAppVersion, HttpStatus.OK, "Correcto");
  //     return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "La app versión no existe");

  //   } catch (error) {
  //     return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor:" + error.message);
  //   }
  // }

  // async update(id: number, updateAppVersionDto: UpdateAppVersionDto): Promise<ApiResponse> {
  //   try {
  //     const findAppVersion = await this.appVersionRepository.findOne(
  //       {
  //         where: {
  //           id
  //         }
  //       }
  //     );
  //     const findAppVersionName = await this.appVersionRepository.findOne(
  //       {
  //         where: {
  //           appName: updateAppVersionDto.appName,
  //           platform: updateAppVersionDto.platform,
  //           type: updateAppVersionDto.type
  //         }
  //       }
  //     );

  //     if (findAppVersion && (!findAppVersionName || (
  //       updateAppVersionDto.type == findAppVersion.type &&
  //       updateAppVersionDto.appName == findAppVersion.appName &&
  //       updateAppVersionDto.platform == findAppVersion.platform &&
  //       id == findAppVersion.id
  //     ))) {
  //       findAppVersion.updateDate = new Date();
  //       const updateAppVersion = Object.assign(findAppVersion, updateAppVersionDto);
  //       this.appVersionRepository.save(updateAppVersion);
  //       return this.commonService.processResponse(updateAppVersion, HttpStatus.OK, "App versión actualizada correctamente");
  //     }
  //     else {
  //       if (!findAppVersion) return this.commonService.processResponse(null, HttpStatus.NOT_FOUND, "La app versión no existe")
  //       else return this.commonService.processResponse(null, HttpStatus.CONFLICT, "El nombre " + findAppVersionName.appName + " ya esta en uso para la plataforma: " + findAppVersionName.platform);
  //     }

  //   } catch (error) {
  //     return this.commonService.processResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error en el servidor: " + error.message)
  //   }
  // }

}
