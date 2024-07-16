import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PineconeService } from '../out/pinecone.repository';
import { UpdatePineconeDto } from './dto/update-pinecone.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as pdf from 'pdf-parse';

@Controller('pinecone')
export class PineconeController {
  constructor(private readonly pineconeService: PineconeService) {}

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(@UploadedFile() file: Express.Multer.File) {
    try {
      // Extraer el contenido del PDF
      const data = await pdf(file.buffer);

      // data.text contiene todo el texto extraído del PDF
      console.log(data.text);

      return {
        message: 'PDF file uploaded and content extracted successfully',
        content: data.text,
      };
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      return { message: 'Error al procesar el PDF', error: error.message };
    }
  }

  @Get()
  findAll() {
    return this.pineconeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pineconeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePineconeDto: UpdatePineconeDto,
  ) {
    return this.pineconeService.update(+id, updatePineconeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pineconeService.remove(+id);
  }
}
