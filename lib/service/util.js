exports.render = function(req, res, data) {
    res.format({
        json: function() {
            res.header('Vary', 'Accept-Encoding');
            res.header("Expires", 0); 

            res.json(data);            
        },
        
        html: function() {
            res.render(req.params.page, data);
        }        
    });
}