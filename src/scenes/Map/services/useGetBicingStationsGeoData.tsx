import { useEffect, useState } from 'react';
import { getBicingStationsGeoData } from './bicingApi';
import { GeoJsonFeatureCollection } from './types';

export default function useGetBicingStationsGeoDatatsx() {
  const [bicingStationsGeoData, setBicingStationsGeoData] =
    useState<GeoJsonFeatureCollection | null>(null);

  useEffect(() => {
    getBicingStationsGeoData().then(stationsGeoData => {
      setBicingStationsGeoData(stationsGeoData);
    });
  }, []);

  return bicingStationsGeoData;
}
