import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Partitioners } from 'kafkajs';
import * as mongoose from 'mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ActivationService } from './activation.service.js';
import { ActivationGateway } from './activation.gateway.js';

// * SCHEMAS DE MONGOOSE
// ! El _id debe ser String porque usamos UUID como correlationId
// ! Si lo dejamos por defecto, Mongoose espera un ObjectId y rechaza el UUID.
const ActivationSchema = new mongoose.Schema({
  _id: { type: String },
  customerId: String,
  planId: String,
  status: String,
  simulateFailure: String,
  steps: { type: mongoose.Schema.Types.Mixed, default: {} },
  history: [mongoose.Schema.Types.Mixed]
}, { strict: false, _id: false });

const OutboxSchema = new mongoose.Schema({
  eventId: String,
  topic: String,
  payload: mongoose.Schema.Types.Mixed,
  status: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/activation-api?directConnection=true'),
    MongooseModule.forFeature([
      { name: 'Activation', schema: ActivationSchema },
      { name: 'Outbox', schema: OutboxSchema }
    ]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'activation-api',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ActivationService, ActivationGateway],
})
export class AppModule {}
