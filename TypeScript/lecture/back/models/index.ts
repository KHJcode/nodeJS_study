import User, { associate as associateUser } from './user';
import Post, { associate as associatePost } from './post';
import Comment, { associate as associateComment } from './comment';
import Hashtag, { associate as associateHashtag } from './hashtag';
import Image, { associate as associateImage } from './image';

export * from './sequelize';

const db = {
  User,
  Post,
  Comment,
  Hashtag,
  Image,
};

export type dbType = typeof db;

associateUser(db);
associatePost(db);
associateComment(db);
associateHashtag(db);
associateImage(db);
