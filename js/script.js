$(function (){// same as document.addEventListener("DOMContentLoaded"...)


    $(".navbar-toggler").blur(function (event){
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $(".navbar-collapse").collapse('hide');
        }
    } )

});

(function (global){
    
    var tekinrest = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesURL = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsURL = 
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    var insertHtml = function (selector,html){
        var targetElement = document.querySelector(selector);
        targetElement.innerHTML = html;
    }

    var showLoading = function (selector) {
        var html = "<div class ='text-center'>";
        html += "<img src='img/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    }

    // return substitute of '{{propName}}'
    // with propValu in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }


    // on page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event){

        // ON first load, show some view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml,
            function(responseText) {
            document.querySelector("#main-content")
                .innerHTML = responseText;
            },
        false);
    });


    // load the menu categories View
    tekinrest.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesURL,buildAndShowCategoriesHTML);
        // 3rd argument is empty , since we're setting it to true as default
    }

    function buildAndShowCategoriesHTML(categories){
        //Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        var categoriesViewHtml =
                        buildCategoriesViewHtml(
                            categories,
                            categoriesTitleHtml,
                            categoryHtml
                        );
                        insertHtml("#main-content",categoriesViewHtml);
                    },
                    false);
            },
        false);
    }

    tekinrest.loadMenuItems = function (categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsURL + categoryShort + ".json",
            buildAndShowMenuItemsHTML
          );
    };


    //Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";
        
        //Loop over categories
        for (var i = 0; i<categories.length; i++){
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html,"name",name);
            html = insertProperty(html,"short_name",short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }   

    // Build html for the single category page based on the data
    // from the server

    function buildAndShowMenuItemsHTML (categoryMenuItems){
        //Load title Snipet of menu items page
        $ajaxUtils.sendGetRequest(menuItemsTitleHtml,
            function(menuItemsTitleHtml){
                // Retrieve single menu item snippet
                $ajaxUtils.sendGetRequest(menuItemHtml,
                    function (menuItemHtml){
                        var menuItemsViewHtml = buildMenuItemsViewHTML(
                            categoryMenuItems,menuItemsTitleHtml,menuItemHtml);
                        insertHtml("#main-content",menuItemsViewHtml);    
                    },false);
            },false);
    }

    function buildMenuItemsViewHTML(
        categoryMenuItems,
        menuItemsTitleHtml,
        menuItemHtml
    ){
        menuItemsTitleHtml = insertProperty(
            menuItemsTitleHtml,
            "name",
            categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(
            menuItemsTitleHtml,
            "special_instructions",
            categoryMenuItems.category.special_instructions);
        var finalHtml = menuItemsTitleHtml;
        finalHtml += "<section class='row'>";

        //Loop over menu items
        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;
        for (var i = 0; i<menuItems.length; i++){
            // insert menu item values
            var html = menuItemHtml;
            html =
                insertProperty(html,"short_name",menuItems[i].short_name);
            html =
                insertProperty(html,"catShortName",catShortName);    
            html =
                insertItemPrice(html,
                                "price_small",
                                menuItems[i].price_small);
            html = 
                insertItemPortionName(html,
                                    "small_portion_name",
                                    menuItems[i].small_portion_name);                    
            html =
                insertItemPrice(html,
                                "price_large",
                                menuItems[i].price_large);
            html = 
                 insertItemPortionName(html,
                                    "large_portion_name",
                                    menuItems[i].large_portion_name);                        
            html = insertProperty(html,"name",menuItems[i].name);
            html = insertProperty(html,"description",menuItems[i].description);
            
            // add clearfix after everysecond menu item
            if (i % 2 != 0) {
                html += 
                 "<div class='clearfix d-lg-block'></div>"
            }
            finalHtml += html;
        }
        
        finalHtml += "</section>";
        return finalHtml;
    }

    function insertItemPrice(html,pricePropName,priceValue){
        //if not specified, replace with empty string
        if (!priceValue) {
            return insertProperty(html,pricePropName,"");
        }

        priceValue = "$" + priceValue.toFixed(2);
        html = insertProperty(html, pricePropName, priceValue);
        return html;
    }

    // Appends portion name in parens if it exists
    function insertItemPortionName(html, portionPropName, portionValue) {
        // If not specified, return original string
        if (!portionValue) {
          return insertProperty(html, portionPropName, "");
        }
    
        portionValue = "(" + portionValue + ")";
        html = insertProperty(html, portionPropName, portionValue);
        return html;
    }

    var switchMenuButtonToActive = function (page) {
        var classValue = document.querySelector("#navHomeButton").className;
        classValue = classValue.replace(new RegExp("active","g"),"");
        document.querySelector("#navHomeButton").className = classValue;

        classValue = document.querySelector("#navMenuButton").className;
        if ( classValue.indexOf("active") == -1 ){//meaning doesn't include active attribute
            classValue += " active";
            document.querySelector("#navMenuButton").className = classValue;
        }
    };

    var switchHomeButtonToActive = function () {
        var classValue = document.querySelector("#navMenuButton").className;
        classValue = classValue.replace(new RegExp("active","g"),"");
        document.querySelector("#navMenuButton").className = classValue;

        classValue = document.querySelector("#navHomeButton").className;
        if ( classValue.indexOf("active") == -1 ){//meaning doesn't include active attribute
            classValue += " active";
            document.querySelector("#navHomeButton").className = classValue;
        }
    }



    global.switchHomeButtonToActive = switchHomeButtonToActive;
    global.switchMenuButtonToActive = switchMenuButtonToActive;
    global.$tekinrest = tekinrest;
})(window);