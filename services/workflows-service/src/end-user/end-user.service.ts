import { Injectable } from '@nestjs/common';
import { EndUserRepository } from './end-user.repository';
import { EndUserCreateDto } from '@/end-user/dtos/end-user-create';
import type { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { Business, BusinessPosition, EndUser, Prisma } from '@prisma/client';
import { EndUserActiveMonitoringsSchema, EndUserAmlHitsSchema } from '@ballerine/common';

@Injectable()
export class EndUserService {
  constructor(
    protected readonly repository: EndUserRepository,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create(args: Parameters<EndUserRepository['create']>[0]) {
    return await this.repository.create(args);
  }

  async list(args: Parameters<EndUserRepository['findMany']>[0], projectIds: TProjectIds) {
    return await this.repository.findMany(args, projectIds);
  }

  async find(id: string, projectIds: TProjectIds) {
    return await this.repository.find({ where: { id } }, projectIds);
  }

  async getById(
    id: string,
    args: Parameters<EndUserRepository['findById']>[1],
    projectIds: TProjectIds,
  ) {
    return await this.repository.findById(id, args, projectIds);
  }

  async createWithBusiness(
    {
      endUser,
      business,
      position,
    }: {
      endUser: Omit<EndUserCreateDto, 'companyName' | 'correlationId'>;
      business: Prisma.BusinessUncheckedCreateWithoutEndUsersInput;
      position?: BusinessPosition;
    },
    projectId: TProjectId,
    businessId?: string,
  ): Promise<EndUser & { businesses: Business[] }> {
    const user = await this.repository.create({
      data: {
        ...endUser,
        businesses: {
          connectOrCreate: {
            where: {
              id: businessId,
            },
            create: business,
          },
        },
        ...(position
          ? {
              endUsersOnBusinesses: {
                create: {
                  businessId: businessId ?? '',
                  position,
                },
              },
            }
          : {}),
        projectId,
      },
      include: {
        businesses: true,
      },
    });

    return user as any;
  }

  async getByEmail(
    email: string,
    projectIds: TProjectIds,
  ): Promise<(EndUser & { businesses?: Business[] }) | null> {
    return await this.repository.find(
      {
        where: {
          email,
        },
        include: {
          businesses: true,
        },
      },
      projectIds,
    );
  }

  async updateById(id: string, endUser: Omit<Prisma.EndUserUpdateArgs, 'where'>) {
    let activeMonitorings;

    if (endUser.data.activeMonitorings !== undefined) {
      activeMonitorings = EndUserActiveMonitoringsSchema.parse(endUser.data.activeMonitorings);
    }

    let amlHits;

    if (endUser.data.amlHits !== undefined) {
      amlHits = EndUserAmlHitsSchema.parse(endUser.data.amlHits);
    }

    return await this.repository.updateById(id, {
      ...endUser,
      data: {
        ...endUser.data,
        activeMonitorings,
        amlHits,
      },
    });
  }
}
