import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../../utils/enums';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import * as types from '../../utils/types';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  public async getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ): Promise<Product[]> {
    return this.productService.getAllProducts(title, minPrice, maxPrice);
  }

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public async createNewProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ): Promise<Product> {
    return this.productService.createNewProduct(body, payload.id);
  }

  @Get(':id')
  public async getOneProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.getOneProduct(id);
  }

  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public async updateProduct(
    @Param('id') id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
