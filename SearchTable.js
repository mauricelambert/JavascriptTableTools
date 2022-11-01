/*
    This file search lines in tables with all columns or a specific column.
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
This class implements a tool to search lines in HTML table.
*/
class TableSearch {
    constructor (table) {
        if (table.have_search) {
            return;
        }

        let input, parent;
        this.table = table;
        input = this.input = document.createElement('input');

        parent = this.parent = table.parentNode;
        input.type = "search";
        input.onchange = this.search.bind(this);
        input.placeholder = "🔍  Search/Filter table values";
        table.have_search = true;

        this.selected_column = null;
        parent.insertBefore(input, table);

        this.headers = table.getElementsByTagName('th');

        this.add_selects();
    }

    /*
    This function adds a select box to headers to filter only on this column.
    */
    add_selects () {
        let counter = 0;

        for (let header of this.headers) {
            let id = counter;
            let select = document.createElement("span");
            select.innerText = "☐";
            select.classList.add("webscripts_column_select");
            select.addEventListener('click', () => {this.select_column(id);});
            header.appendChild(select);
            header.selected = false;
            header.select = select;

            counter++;
        }
    }

    /*
    This function unselects columns.
    */
    unselect_column () {
        this.selected_column = null;

        for (let header of this.headers) {
            header.select.innerText = "☐";
            header.select.classList.remove("selected");
            header.select.classList.remove("unselected");
        }

        this.search();
    }

    /*
    This function selects columns.
    */
    select_column (id) {
        if (this.selected_column !== null) {
            this.unselect_column();
            return;
        }

        this.selected_column = id;
        let counter = 0;

        for (let header of this.headers) {
            if (counter === id) {
                header.select.innerText = "☑";
                header.select.classList.add("selected");
            } else {
                header.select.innerText = "☒";
                header.select.classList.add("unselected");
            }

            counter++;
        }

        this.search();
    }

    /*
    This function searchs in table.
    */
    search() {
        let filter = this.input.value.toUpperCase();
        let lines = this.table.getElementsByTagName("tr");

        for (let line of lines) {
            let columns = line.getElementsByTagName("td");

            if (!columns.length) {
                continue;
            }

            if (this.selected_column !== null) {
                columns = [columns[this.selected_column]];
            }

            let is_matching = false;
            for (let column of columns) {
                let value = column.textContent || column.innerText;

                if (value.toUpperCase().indexOf(filter) > -1) {
                    is_matching = true;
                }
            }

            if (is_matching) {
                line.style.display = "";
            } else {
                line.style.display = "none";
            }
        }
    }
}