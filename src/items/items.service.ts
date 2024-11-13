import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiResponse } from '../common/response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from './entities/item.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ItemViewDto } from './dto/items-view';
import { User } from '../users/user.entity';
import { ItemType } from './items-enums';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private commonService: CommonService
  ) { }

  async create(createItemDto: CreateItemDto, idUserCreated: string): Promise<ApiResponse> {
    try {
      const user = await this.userRepository.findOne(
        {
          where: {
            id: idUserCreated,
          }
        }
      );

      if (!user) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          'Usuario no encontrado'
        );
      }
      const findItem = await this.itemRepository.findOne({
        where: {
          title: createItemDto.title,
          idProviderCreated: createItemDto.idProviderCreated,
        },
      });
      if (!findItem) {
        const newItem = this.itemRepository.create({
          ...createItemDto,
          userCreationId: user.id,
          userCreationName: user.completeName
        });
        const savedItem = await this.itemRepository.save(newItem);
        let savedItemPlain: ItemViewDto = plainToClass(ItemViewDto, savedItem);
        return this.commonService.processResponse(savedItemPlain);
      }
      return this.commonService.processResponse(
        null,
        HttpStatus.FOUND,
        `${createItemDto.title} ya existe!!!`
      );
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }

  async findAll(): Promise<ApiResponse> {
    try {
      const itemsList = await this.itemRepository.createQueryBuilder('item')
        .leftJoinAndSelect('item.createdProvider', 'createdProvider')
        .getMany();

      let itemsListPlain: ItemViewDto[] = plainToClass(ItemViewDto, itemsList);
      return this.commonService.processResponse(itemsListPlain);
    }
    catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }

  async findByProducer(idProviderCreated: number): Promise<ApiResponse> {
    try {
      // Helper function to get and transform items
      const getItems = async (type: ItemType | null) => {
        const query = this.itemRepository.createQueryBuilder('item')
          .where({ idProviderCreated });

        if (type !== null) {
          query.andWhere('item.type = :type', { type });
        } else {
          query.andWhere('item.type != :newType AND item.type != :moreSelleredType', { newType: ItemType.New, moreSelleredType: ItemType.MoreSellered });
        }

        query.leftJoinAndSelect('item.createdProvider', 'createdProvider');
        const items = await query.getMany();
        return plainToInstance(ItemViewDto, items);
      };

      const itemsListPlainGeneral = await getItems(null);
      const itemsListPlainNew = await getItems(ItemType.New);
      const itemsListPlainMoreSellered = await getItems(ItemType.MoreSellered);

      const values = {
        general: itemsListPlainGeneral,
        new: itemsListPlainNew,
        moreSellered: itemsListPlainMoreSellered,
      };

      return this.commonService.processResponse(values);
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }
  
  async updateItemType(id: number, newType: ItemType) {
    try {
      const findItem = await this.itemRepository.findOne({ where: { id } });
      if (!findItem) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          'Producto no encontrado: ' + id,
        );
      }
      const itemTypeValues = Object.values(ItemType);
      if (!itemTypeValues.includes(newType)) {
        return this.commonService.processResponse(
          null,
          HttpStatus.NOT_FOUND,
          'Tipo incorrecto: ' + newType,
        );
      }
      findItem.type = newType;
      const savedItem = await this.itemRepository.save(findItem);
      return this.commonService.processResponse(
        savedItem,
        HttpStatus.OK,
        'Tipo de producto actualizado correctamente'
      );
    } catch (error) {
      return this.commonService.processResponse(
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Error en el servidor: ' + error.message,
      );
    }
  }


  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
