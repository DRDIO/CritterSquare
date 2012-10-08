            var loaded = {};

            function dustLoad(file) {
                if (!loaded.hasOwnProperty(file)) {
                    $.ajax({
                        dataType:   "script",
                        cache:      true,
                        url:        '/js/dust' + file + '.js'
                    }).done(function() {
                        loaded[file] = true;
    
                        dustRender(file);
                    });
                } else {
                    dustRender(file);
                }
            }

            function dustRender(file) {
                $.getJSON(file, function(data) {
                    console.log(data);

                    var source = file.replace('/', '');
                
                    dust.render(source, data, function(err, out) {
                        if (err == null) {
                            $('#content').html(out);
                        }
                    });
                });
            }

            $(function() {
                dustLoad('/home');

                $('a').click(function(e) {
                    e.preventDefault();

                    var file = $(this).attr('href');
                    dustLoad(file);
                });
            });