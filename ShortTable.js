/*
    This file shorts tables with click event on headers.
    Copyright (C) 2022  Maurice Lambert
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
This class adds an event listener on each
table header to shorts tables by values.
*/
class ShortTable {

    /*
    This function returns the column value.
    */
    get_value (line, id) {
        return line.children[id].innerText || line.children[id].textContent;
    }

    /*
    This function compares two values.
    */
    compare (value1, value2) {
        if (value1 !== '' && value2 !== '' && !isNaN(value1) && !isNaN(value2)) {
            return value1 - value2;
        } else {
            return value1.toString().localeCompare(value2)
        }
    }

    /*
    This function generates the event listener callback.
    */
    get_callback (id, ascendant) {
        return function short_callback (line1, line2) {
            if (!ascendant) {
                let temp = line1;
                line1 = line2;
                line2 = temp;
            }

            return ShortTable.prototype.compare(ShortTable.prototype.get_value(line1, id), ShortTable.prototype.get_value(line2, id));
        };
    }

    /*
    This function shorts the table.
    */
    event(event) {
        let table = this.closest('table');
        let id = Array.from(this.parentNode.children).indexOf(this);

        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(ShortTable.prototype.get_callback(id, window.ascendant = !window.ascendant))
            .forEach(line => table.appendChild(line));
    }

    /*
    This function adds listeners on each table headers.
    */
    add_listeners () {
        document.querySelectorAll('th').forEach((header) => {
            if (!header.have_short_event) {
                header.addEventListener('click', ShortTable.prototype.event.bind(header));
                header.have_short_event = true;
            }
        });
    }
}
