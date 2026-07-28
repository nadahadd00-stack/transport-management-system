import { User } from './interface';

export const admin: User = {
  id: 1,
  name: 'Administrateur TMS',
  email: 'admin@tms.ma',
  avatar: 'images/avatar.jpg',
};

export const guest: User = {
  name: 'Invité',
  email: 'invite@tms.ma',
  avatar: 'images/avatar-default.jpg',
};