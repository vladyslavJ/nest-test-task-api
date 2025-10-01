import { Controller, Get, Redirect } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  @Get()
  @Redirect('/api', 301)
  @ApiOperation({ summary: 'Redirect to API documentation' })
  @ApiResponse({
    status: 301,
    description: 'Redirect to Swagger documentation',
  })
  redirectToApiDocs() {
    return { url: '/api' }
  }
}
