import { ObjectHelper } from "./objectHelper";

export class SortValueConverter {
    public toView(array: any, property: string, direction: string) {
        if (!array || array.length == 0) {
            return array;
        }
        if (!property) {
          return array;
        }
        if (!direction) {
          direction = 'asc';
        }
        //    var arrayWithValues = array.filter(x=>x.property !== undefined ||x[property] !== null);
        let factor = direction.match(/^desc*/i) ? 1 : -1;
        var retvalue = array.sort((a: any, b: any) => {
            var textA: string;
            var textB: string;

            if (property.indexOf('.') >= 0) {
                //then sub-object. Sort on Sub-object's property
                var splittedProperty = property.split('.');
                textA = this.getPropertyValue(a, splittedProperty);
                textB = this.getPropertyValue(b, splittedProperty);
            }
            else {
                textA = a.toUpperCase ? a[property].toUpperCase() : a[property];
                textB = b.toUpperCase ? b[property].toUpperCase() : b[property];
            }

            if ((typeof textA !== 'string' && typeof textB !== 'string') || (!ObjectHelper.hasValue(textA) || !ObjectHelper.hasValue(textB))) {
                if (!ObjectHelper.hasValue(textA) && !ObjectHelper.hasValue(textB)) {
                    return 0;
                }
                if (!ObjectHelper.hasValue(textA)) {
                    return 1;
                }
                if (!ObjectHelper.hasValue(textB)) {
                    return -1;
                }
                return (textA < textB) ? factor : (textA > textB) ? -factor : 0;
            }

            if (factor == 1) {
                return this.naturalCompare(textB, textA);
            } else {
                return this.naturalCompare(textA, textB);
            }
        });
        return retvalue;
    }

    private naturalCompare(a, b) {
        var ax = [], bx = [];

        if (a.replace) {
            a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { ax.push([$1 || Infinity, $2 || '']); });
        }

        if (b.replace) {
            b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) { bx.push([$1 || Infinity, $2 || '']); });
        }

        while (ax.length && bx.length) {
            var an = ax.shift();
            var bn = bx.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) {
                return nn;
            }
        }

        return ax.length - bx.length;
    }

    /**
     * Method that gets the actual value of the property in an object hierarchy. Allows for sorting by foo.bar.baz
     * @param array The base object
     * @param splittedProperty Splitted string containing elements of path.
     */
    private getPropertyValue(array: any, splittedProperty: string[]) {
        if (!ObjectHelper.hasValue(array)) { return null; }

        var obj = array;

        for (let i = 0; i < splittedProperty.length; i++) {
            if (!ObjectHelper.hasValue(obj)) { return null; }
            obj = obj[splittedProperty[i]];
        }

        if (!ObjectHelper.hasValue(obj)) { return null; }

        return array.toUpperCase ? obj.toUpperCase() : obj;
    }
}
