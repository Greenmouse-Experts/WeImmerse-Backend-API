import { Model, DataTypes, Sequelize } from 'sequelize';

class Certificate extends Model {
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public certificateUrl!: string;
  public issueDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initModel = (sequelize: Sequelize) => {
  Certificate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        // references: { model: 'courses', key: 'id' },
        onDelete: 'CASCADE',
      },
      certificateUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issueDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Certificate',
      timestamps: true,
      tableName: 'certificates',
    }
  );
};

export default Certificate;
export { initModel };
