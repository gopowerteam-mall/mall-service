import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
import {
  ApiTags,
  ApiSecurity,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { PaymentOrder } from 'src/entities/payment-order.entity'
import { ProductOrder } from 'src/entities/product-order.entity'
import { IdInput } from 'src/shared/typeorm/dto/id.input'
import { SubmitOrderInput } from '../dtos/order.dto'

@Controller('order')
@ApiTags('order')
@ApiSecurity('access-token')
export class OrderController {
  @Post('submit')
  @ApiOperation({ operationId: 'submitOrder', summary: '提交订单' })
  @ApiOkResponse({ type: ProductOrder })
  submitOrder(@Body() input: SubmitOrderInput) {
    return '123'
  }

  @Post('payment/:id')
  @ApiOperation({ operationId: 'paymentOrder', summary: '支付订单' })
  @ApiOkResponse({ type: PaymentOrder })
  paymentOrder(@Param() input: IdInput) {
    return '123'
  }

  @Put('cancel/:id')
  @ApiOperation({ operationId: 'cancelOrder', summary: '取消订单' })
  @ApiOkResponse({ type: ProductOrder })
  cancelOrder(@Param() input: IdInput) {
    return '123'
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'deleteOrder', summary: '删除订单' })
  @ApiOkResponse({ type: ProductOrder })
  deleteOrder(@Param() input: IdInput) {
    return '123'
  }
}
