angular.module('baasic.blog').service("meteringUtilityService", [
    function () {
        return {
            compileCategory: function (rateBy, item) {
                if (rateBy === 'year') {
                    return moment.utc(item.dateCreated).format('YYYY');
                } else if (rateBy === 'month') {
                    return moment.utc(item.dateCreated).format('MMMM YYYY');
                } else if (rateBy === 'week') {
                    return moment.utc(item.dateCreated).format('WW MM.YY');
                } else if (rateBy === 'day') {
                    return moment.utc(item.dateCreated).format('DD.MM.YY');
                } else if (rateBy === 'hour') {
                    return moment.utc(item.dateCreated).format('hh DD.MM.YY');
                } else if (rateBy === 'minute') {
                    return moment.utc(item.dateCreated).format('hh:mm DD.MM.YY');
                }
            },
            getDriveDefaultFilter: function () {
                return {
                    pageNumber: 1,
                    pageSize: 1440,
                    fields: 'categoryId,dateCreated,name,moduleName,value',
                    category: 'Drive',
                    orderBy: 'dateCreated',
                    orderDirection: 'asc',
                    rateBy: 'minute',
                    from: 'this month',
                    to: 'now'
                };
            },
            getAmbientDefaultFilter: function () {
                return {
                    pageNumber: 1,
                    pageSize: 1440,
                    fields: 'categoryId,dateCreated,name,moduleName,value',
                    orderBy: 'dateCreated',
                    orderDirection: 'asc',
                    rateBy: 'minute',
                    from: 'this month',
                    to: 'now',
                    category: 'Ambient'
                };
            }
        };
    }
]);