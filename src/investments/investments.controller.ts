import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementsService } from './movements.service';
import { BalancesService } from './balances.service';
import { SQSService } from '../aws/sqs.service';
import { Movement, OPERATIONS } from '../entities/movements.entity';
import { ConfigService } from '@nestjs/config';
import { Balance } from 'src/entities';

interface SQSResponse {
  message: string
};

@ApiBearerAuth()
@ApiTags('investments')
@UseGuards(AuthGuard('jwt'))
@Controller('investments')
export class InvestmentsController {
  constructor(
    private configService: ConfigService,
    private readonly sqsService: SQSService,
    private readonly investmentService: InvestmentsService,
    private readonly movementService: MovementsService,
    private readonly balanceService: BalancesService,
  ) {}

  @Post('/buy/skn')
  @ApiOperation({ summary: 'Buy SKN coins' })
  deposit(@Request() request, @Body() createMovementDto: CreateMovementDto) {
    return this.investmentService.depositZKN(createMovementDto, {
      authUser: request.user,
    });
  }

  @Post('/invest/:projectId')
  @ApiOperation({ summary: 'Invest to a project' })
  async invest(
    @Request() request,
    @Param('projectId') projectId: number,
    @Body() createMovementDto: CreateMovementDto,
  ):Promise<SQSResponse>  {
    await this.sqsService.sendMessage(this.configService.get('AWS').SQS.URL, {
      operation: OPERATIONS.DEPOSIT,
      projectId,
      userId: request.user.id,
      amount: createMovementDto.amount,
      at: new Date().toString(),
    });

    return {
      message: "Processing investment."
    }
  }

  @Post('/withdraw/:projectId')
  @ApiOperation({ summary: 'Withdraw of a project' })
  async withdraw(
    @Request() request,
    @Param('projectId') projectId: number,
    @Body() createMovementDto: CreateMovementDto,
  ):Promise<SQSResponse> {
    await this.sqsService.sendMessage(this.configService.get('AWS').SQS.URL, {
      operation: OPERATIONS.WITHDRAWAL,
      projectId,
      userId: request.user.id,
      amount: createMovementDto.amount,
      at: new Date().toString(),
    });

    return {
      message: "Processing withdrawal."
    }
  }

  @Get('/movements/:projectId')
  @ApiOperation({ summary: 'Get a list of movements/transaction of a project' })
  findAllMovement(@Request() request, @Param('projectId') projectId: number):Promise<Movement[]> {
    return this.movementService.findAll(
      {
        projectId,
      },
      { authUser: request.user },
    );
  }

  @Get('/balance')
  @ApiOperation({ summary: 'Get a list of balances' })
  findAllBalance(@Request() request):Promise<Balance[]> {
    return this.balanceService.findAll({ authUser: request.user });
  }
}
