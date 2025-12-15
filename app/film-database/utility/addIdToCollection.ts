import type { UserCollection } from 'app/film-database/context/UserCollectionContext';

type Payload = {
  data: UserCollection['data'] | undefined;
  colIndex: number;
};

export const addIdToCollection = (
  userCollections: Record<string, UserCollection>,
  payload: Payload
): Record<string, UserCollection> => {
  const hasHitCollectionLimit = Object.keys(userCollections).length >= 5;
  if (hasHitCollectionLimit) return userCollections;

  const key = `user-collection-${payload.colIndex}`;
  const target = userCollections[key];

  return {
    ...userCollections,
    [key]: {
      header: target?.header ?? 'Unnamed Collection',
      data: target?.data && payload.data ? [...target.data, ...payload.data] : payload.data ? [...payload.data] : [],
    },
  };
};
