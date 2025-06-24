CREATE OR REPLACE FUNCTION get_tags_for_entity(
    entity_id_param UUID,
    entity_type_param TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(tags.*)
        FROM entity_tags
        JOIN tags ON entity_tags.tag_id = tags.id
        WHERE entity_tags.entity_id = entity_id_param
        AND entity_tags.entity_type = entity_type_param
    );
END;
$$; 