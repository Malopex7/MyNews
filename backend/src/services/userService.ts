import { User, IUser } from '../models';

export const findById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
};

export const findAll = async (
    page: number = 1,
    limit: number = 20
): Promise<{ users: IUser[]; total: number; totalPages: number }> => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find().skip(skip).limit(limit),
        User.countDocuments(),
    ]);

    return {
        users,
        total,
        totalPages: Math.ceil(total / limit),
    };
};

export const update = async (
    id: string,
    data: Partial<{ name: string; email: string }>
): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const remove = async (id: string): Promise<IUser | null> => {
    return User.findByIdAndDelete(id);
};
