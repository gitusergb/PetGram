import type { Post } from './types';
import { Category } from './types';


export const DUMMY_POSTS: Post[] = [
  {
    id: 'post_1',
    userId: 'user2',
    username: 'GoldenRetrieverLover',
    userAvatar: 'https://picsum.photos/id/237/48/48',
    imageUrl: 'https://picsum.photos/id/1025/600/600',
    caption: 'Enjoying a beautiful day at the park! ☀️ #dogsofinstagram #goldenretriever',
    hashtags: ['#dogsofinstagram', '#goldenretriever'],
    likes: ['user1', 'user2', 'user3'],
    comments: [
      { id: 'comment_1', userId: 'user3', username: 'PoodleFan', text: 'So cute!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ],
    category: Category.Dog,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    filter: 'none',
  },
  {
    id: 'post_2',
    userId: 'user3',
    username: 'CatPerson',
    userAvatar: 'https://picsum.photos/id/10/48/48',
    imageUrl: 'https://picsum.photos/id/1074/600/600',
    caption: 'Nap time is the best time. 😴 #catlife #sleepycat',
    hashtags: ['#catlife', '#sleepycat'],
    likes: ['user4'],
    comments: [],
    category: Category.Cat,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    filter: 'sepia(0.6)',
  },
   {
    id: 'post_3',
    userId: 'user4',
    username: 'BirdWatcher',
    userAvatar: 'https://picsum.photos/id/40/48/48',
    imageUrl: 'https://picsum.photos/id/1062/600/600',
    caption: 'My colorful friend saying hello! #parrot #birdlovers',
    hashtags: ['#parrot', '#birdlovers'],
    likes: ['user1', 'user5', 'user6', 'user7'],
    comments: [
       { id: 'comment_2', userId: 'user1', username: 'NatureLover', text: 'Stunning colors!', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
       { id: 'comment_3', userId: 'user3', username: 'CatPerson', text: 'Wow!', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    ],
    category: Category.Bird,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    filter: 'grayscale(1)',
  },
];
