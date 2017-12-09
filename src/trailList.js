import trailsJson from 'json-loader!./trails';

module.exports = () => {
    return [].concat(trailsJson.items).map(trail => Object.assign({}, trail));
}