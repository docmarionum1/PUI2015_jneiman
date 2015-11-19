SELECT 
    start_station_id, 
    start_station_name, 
    COUNT(*) as trip_count,
    CDB_TransformToWebmercator(CDB_LatLng(
        start_station_latitude,
        start_station_longitude)
    ) as the_geom_webmercator
FROM citibike 
WHERE 
    ST_DWithin(
        CDB_LatLng(end_station_latitude, end_station_longitude)::geography, 
        CDB_LatLng(40.7307602, -73.9974086),
        1000
    )
    AND
    EXTRACT(DOW FROM starttime) IN (0,6)
GROUP BY 
    start_station_id,
    start_station_name,
    end_station_id,
    start_station_latitude,
    start_station_longitude
ORDER BY trip_count DESC