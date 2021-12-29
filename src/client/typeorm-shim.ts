// The shim provided with TypeOrm misses BaseEntity
// So we make our our own shim. With ~hookers and booze~ BaseEntity.

export * from "typeorm/typeorm-class-transformer-shim";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-empty-function */
export function BaseEntity () {}
