import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
//pactumjs->test

describe('App e2e ',()=>{
  let app:INestApplication;
  let prisma:PrismaService
  beforeAll (async()=>{
const moduleRef=
await Test.createTestingModule({
  imports:[AppModule],
}).compile();
const app = moduleRef.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({
       whitelist: true 
      }),
  )
  await app.init();
  await app.listen(3333)
   
  prisma=app.get(PrismaService)
  await prisma.cleanDb()
  }) 
  afterAll(()=>{
    app.close();
  })

  describe ('Auth',()=>{
  describe ('Signup',()=>{
    it('should signup',()=>{
      const dto:AuthDto={
        email:'vicky@gmail.com',
        password:'123'
        
      }
      return pactum
      .spec()
      .post(
        'http://localhost:3333/auth/signup'
        ).withBody(dto)
        .expectStatus(201)
    });
  })

  describe ('Signin',()=>{})

  });

  describe ('User',()=>{
  describe ('Get me',()=>{})

});
  describe ('Bookmarks',()=>{
  describe('Create bookmark',()=>{})
  describe('Get bookmark',()=>{})
  describe('Get bookmark by id',()=>{})
  describe('Edit bookmark ',()=>{})
  describe('Delete bookmark by id',()=>{})

});
}) 