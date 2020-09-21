import {
  Controller,
  UseGuards,
  Get,
  Param,
  Put,
  Body,
  Request,
} from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { AuthGuard } from '@nestjs/passport';
import { SubscriberDto } from 'src/dto/subscriber.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userRole } from 'src/helpers/constants';
import { User } from 'entities/user.entity';

@Controller('subscriber')
export class SubscriberController {
  constructor(private subscriberService: SubscriberService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(userRole.NORMAL, userRole.PREMIUM)
  @Put('new')
  async findByCategory(
    @Body() subscriber: SubscriberDto,
    @Request() { user }: { user: User },
  ) {
    const subscriberToSave = {
      ...subscriber,
      user,
    };
    return {
      subscriber: await this.subscriberService.saveSubscriber(subscriberToSave),
    };
  }
}
