import { Controller, Get, Post, Put, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserSettingsRequestDto, TestCookiesRequestDto } from './dto/user-settings.dto';
import { UserEntity } from './entities/user.entity';
import { UserSettingsEntity } from './entities/user-settings.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserEntity] })
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user settings & cookie configuration' })
  @ApiResponse({ status: 200, description: 'User settings', type: UserSettingsEntity })
  async getSettings(@CurrentUser() user: { id: string }): Promise<UserSettingsEntity> {
    return this.usersService.getUserSettings(user.id);
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user settings and platform cookies' })
  @ApiResponse({ status: 200, description: 'Updated user settings', type: UserSettingsEntity })
  async updateSettings(
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateUserSettingsRequestDto,
  ): Promise<UserSettingsEntity> {
    return this.usersService.updateUserSettings(user.id, dto);
  }

  @Post('settings/test-cookies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test session cookie authentication on HeadHunter or Habr Career' })
  @ApiResponse({ status: 200, description: 'Cookie test result' })
  async testCookies(
    @CurrentUser() user: { id: string },
    @Body() dto: TestCookiesRequestDto,
  ): Promise<{ isValid: boolean; platform: 'hh' | 'habr'; username?: string; message: string }> {
    return this.usersService.testCookies(dto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User successfully created', type: UserEntity })
  async create(@Body() dto: CreateUserRequestDto): Promise<UserEntity> {
    return this.usersService.createUserFromDto(dto);
  }
}
