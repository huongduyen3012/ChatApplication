import database from '@react-native-firebase/database';

export const MockUsers = async () => {
  const mockUser = {
    mockuser1: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=5',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser2: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=11',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser3: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=3',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser4: {
      name: 'Diana Prince',
      email: 'diana@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=9',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser5: {
      name: 'Edward Stark',
      email: 'edward@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=7',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser6: {
      name: 'Fiona Green',
      email: 'fiona@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=13',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser7: {
      name: 'George Wilson',
      email: 'george@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=15',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser8: {
      name: 'Helen Miller',
      email: 'helen@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=23',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser9: {
      name: 'Ian Cooper',
      email: 'ian@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=17',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser10: {
      name: 'Julia Davis',
      email: 'julia@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=21',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser11: {
      name: 'Kevin Parker',
      email: 'kevin@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=19',
      createdAt: database.ServerValue.TIMESTAMP,
    },
    mockuser12: {
      name: 'Laura White',
      email: 'laura@example.com',
      imageUrl: 'https://i.pravatar.cc/150?img=25',
      createdAt: database.ServerValue.TIMESTAMP,
    },
  };

  return mockUser;
};
