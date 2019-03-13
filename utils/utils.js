const Path = require('path')
const Express = require('express')
const FS = require('fs')
const loader = function (routedir, route, parent) {
    var dir = Path.join(routedir, "/" + route + "/");
    //Logger.info("load route file by:" + dir);
    var files = FS.readdirSync(dir);
    const routeMap = {};
    for (var i in files) {
        var extname = Path.extname(files[i]);
        if (extname == '') {
            const routeMapChild =  loader(dir + "/", files[i], parent + files[i] + '/');
            Object.assign(routeMap,routeMapChild);
        }
        if (extname == '.js') {
            var mod = require(Path.join(dir, files[i]));
            var routes = Express.Router();
            if (typeof mod.get == 'function') {
                routes.get('/', mod.get);
            }
            if (typeof mod.post == 'function') {
                routes.post('/', mod.post);
            }
            if (typeof mod.postFile == 'function') {
                routes.post('/', UploadFile.any(), mod.postFile);
            }
            if (typeof mod.put == 'function') {
                routes.put('/', mod.put);
            }
            if (typeof mod.delete == 'function') {
                routes.delete('/', mod.delete);
            }
            routeMap[parent + Path.basename(files[i], '.js') + "/"] = routes
        }
    }
    return  routeMap 
}


module.exports  = {
    loader:loader
}