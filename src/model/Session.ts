import { ISession } from "connect-typeorm";
import { BaseEntity, Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class Session extends BaseEntity implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt;
 
  @PrimaryColumn("varchar", { length: 255 })
  public id;
 
  @Column("text")
  public json;

  constructor() {
    super();
    this.expiredAt = Date.now();
    this.id = "";
    this.json = "";
  }
}
