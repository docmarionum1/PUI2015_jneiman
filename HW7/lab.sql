SELECT 	CDB_TransformToWebmercator(
  ST_MakeLine(
  	CDB_LatLng(start_station_latitude,start_station_longitude),
    CDB_LatLng(end_station_latitude,end_station_longitude)
  )) as the_geom_webmercator, tripduration

FROM jn1573.citibike

