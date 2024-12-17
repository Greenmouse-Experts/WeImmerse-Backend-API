// models/lesson.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class Lesson extends Model {
    public id!: string;
    public moduleId!: string;
    public courseId!: string;
    public title!: string;
    public content!: string | null;
    public contentType!: 'text' | 'quiz' | 'assignment' | 'youtube' | 'video' | 'audio' | 'article';
    public contentUrl!: string | null;
    public duration!: number;
    public sortOrder!: number;
    public status!: 'draft' | 'published';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
        // Define associations here
        // Example:
        this.belongsTo(models.Module, { as: "module", foreignKey: "moduleId" });
        this.belongsTo(models.Course, { as: "course", foreignKey: "courseId" });
        this.belongsToMany(models.User, {
            as: 'completedLessons',
            through: 'completions',
            foreignKey: 'lessonId',
            otherKey: 'userId',
        });
    }

    // Add custom instance methods
    public async isCompleted(userId: string): Promise<boolean> {
        const completion = await (this as any).getCompletions({ where: { id: userId } });
        return completion.length > 0;
    }

    public static async findByCourse(courseId: string) {
        const lessons = await Lesson.findAll({
            where: { courseId },
            order: [['sortOrder', 'ASC']],
        });
        return lessons;
    }

    public static async findByModule(moduleId: string) {
        const lessons = await Lesson.findAll({
            where: { moduleId },
            order: [['sortOrder', 'ASC']],
        });
        return lessons;
    }

    public static async updateDraggable(data: { lessonId: string; sortOrder: number; moduleId: string }[]) {
        for (const item of data) {
            const lesson = await Lesson.findByPk(item.lessonId);
            if (lesson) {
                lesson.sortOrder = item.sortOrder;
                lesson.moduleId = item.moduleId;
                await lesson.save();
            }
        }
    }
}

const initModel = (sequelize: Sequelize) => {
    Lesson.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        moduleId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'modules', // Ensure this matches the modules table name
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        courseId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courses', // Ensure this matches the courses table name
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        contentType: {
            type: DataTypes.ENUM('text', 'quiz', 'assignment', 'youtube', 'video', 'audio', 'article'),
            defaultValue: 'video',
        },
        contentUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        duration: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('draft', 'published'),
            defaultValue: 'draft',
        },
    }, {
        sequelize,
        modelName: "Lesson",
        timestamps: true,
        paranoid: false,
        tableName: "lessons",
    });
};

export default Lesson;
export { initModel };