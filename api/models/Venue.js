module.exports = {

    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        key  : { type: 'string', unique: true },
        name : { type: 'string'},
        lat  : { type: 'float' },
        lng  : { type: 'float' },
        power : { type: 'integer' },
        category : { type: 'string' }
    }
};