import { sortFavorites } from '@/favorites/utils/sortFavorites';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { useGetObjectRecordIdentifierByNameSingular } from '@/object-metadata/hooks/useGetObjectRecordIdentifierByNameSingular';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { usePrefetchedData } from '@/prefetch/hooks/usePrefetchedData';
import { PrefetchKey } from '@/prefetch/types/PrefetchKey';
import { View } from '@/views/types/View';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { usePrefetchedFavoritesData } from './usePrefetchedFavoritesData';

export const useWorkspaceFavorites = () => {
  const { workspaceFavorites } = usePrefetchedFavoritesData();

  const { records: views } = usePrefetchedData<View>(PrefetchKey.AllViews);
  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);
  const { objectMetadataItem: favoriteObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: CoreObjectNameSingular.Favorite,
    });
  const getObjectRecordIdentifierByNameSingular =
    useGetObjectRecordIdentifierByNameSingular();

  const favoriteRelationFieldMetadataItems = useMemo(
    () =>
      favoriteObjectMetadataItem.fields.filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.type === FieldMetadataType.RELATION &&
          fieldMetadataItem.name !== 'workspaceMember' &&
          fieldMetadataItem.name !== 'favoriteFolder',
      ),
    [favoriteObjectMetadataItem.fields],
  );

  const sortedWorkspaceFavorites = useMemo(
    () =>
      sortFavorites(
        workspaceFavorites.filter((favorite) => favorite.viewId),
        favoriteRelationFieldMetadataItems,
        getObjectRecordIdentifierByNameSingular,
        false,
        views,
        objectMetadataItems,
      ),
    [
      workspaceFavorites,
      favoriteRelationFieldMetadataItems,
      getObjectRecordIdentifierByNameSingular,
      views,
      objectMetadataItems,
    ],
  );

  const workspaceFavoriteIds = new Set(
    sortedWorkspaceFavorites.map((favorite) => favorite.recordId),
  );

  const favoriteViewObjectMetadataIds = new Set(
    views.reduce<string[]>((acc, view) => {
      if (workspaceFavoriteIds.has(view.id)) {
        acc.push(view.objectMetadataId);
      }
      return acc;
    }, []),
  );

  const { activeObjectMetadataItems } = useFilteredObjectMetadataItems();

  const activeObjectMetadataItemsInWorkspaceFavorites =
    activeObjectMetadataItems.filter((item) =>
      favoriteViewObjectMetadataIds.has(item.id),
    );

  return {
    workspaceFavorites: sortedWorkspaceFavorites,
    workspaceFavoritesObjectMetadataItems:
      activeObjectMetadataItemsInWorkspaceFavorites,
  };
};
