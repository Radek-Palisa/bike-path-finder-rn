import { useEffect, useState } from 'react';
import { getBikeStationsInfo } from './bicingApi';
import { StationsInfo } from './types';

export default function useGetBikeStationsInfo() {
  const [bicingStationsGeoData, setBicingStationsGeoData] =
    useState<StationsInfo | null>(null);

  useEffect(() => {
    getBikeStationsInfo().then(stationsGeoData => {
      setBicingStationsGeoData(stationsGeoData);
    });
  }, []);

  return bicingStationsGeoData;
}
