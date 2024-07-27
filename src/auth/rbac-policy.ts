import { RolesBuilder } from 'nest-access-control';
import { Role } from './enums/roles';

export const RBAC_POLICY: RolesBuilder = new RolesBuilder();

// prettier-ignore
RBAC_POLICY
  .grant(Role.CUSTOMER)
    .readOwn('customerData')
    .updateOwn('customerData')
    .readAny('productData')
    .readAny('farmData')
  .grant(Role.FARMER)
    .extend(Role.CUSTOMER)
    .createOwn('productData')
    .updateOwn('productData')
    .deleteOwn('productData')
  .grant(Role.ADMIN)
    .extend(Role.FARMER)
    .readAny('customerData')
    .updateAny('customerData')
    .deleteAny('customerData')
    .readAny('productData')
    .updateAny('productData')
    .deleteAny('productData')
    .readAny('farmerData')
    .updateAny('farmerData')
    .deleteAny('farmerData')

