steal('canui/form/combobox')
    .then(function ($)
    {


        can.Control("can.ui.form.Combobox.Ajax", {
            defaults: {
                loadingMessage: "Loading ...",
                process: function (data)
                {
                    return data.data ? data.data : data;
                }
            }
        },
    {
        setup: function (el, options)
        {
            if (el.nodeName == "INPUT")
            {
                var el = $(el);
                var id = el.attr("id"),
                    className = el.attr("class"),
                    name = el.attr("name");

                var input = $("<input type='text' />").attr({
					id: id,
					name : name,
					className : className
				});

                el.after(input);
                el.remove();
				
				$.extend(options, {overrideDropdown: true});
                input.can_ui_form_combobox(options);
                this._super(input[0], options);
            }
        },
        "show:dropdown": function (el, ev, combobox, callback)
        {
            if ( !this.notFirstFocus )
            {
				combobox.dropdown().html("<span class='loadingText'>" + this.options.loadingMessage + "</span>");
				combobox.dropdown().control().isfirstPass = false;
				combobox.dropdown().show();
				combobox.dropdown().control().style();
                this.loadDataFromServer( combobox, callback );
                this.notFirstFocus = true;
            }
        },
        loadDataFromServer: function (combobox, callback, params, isAutocompleteData)
        {
            $.ajax({
                url: this.options.url,
                type: 'post',
                //dataType: 'json',
                //data: params || "loadOnDemand",
                data: this.options.data,
                contentType: "application/json; charset=utf-8",
                success: this.proxy('showData', combobox, isAutocompleteData, callback),
                error: this.proxy('loadDataFromServerError'),
                fixture: "-items"
            })
        },
        showData: function (combobox, isAutocompleteData, callback, data)
        {
            data = data.d;
			
			// hide the loading message
			combobox.dropdown().hide();
			
			// lets check if ajax combobox was preloaded with a default value
			var oldSelectedValue = combobox.currentItem.value,
				newSelectedValue;
				
			// lets clean the currently selected item
			combobox.clearSelection();
			// dropdown_controller will ignore us if we dont force firstPass
			// when ajax combobox is prepopulated (already had a first pass you see)
			combobox.dropdown().control().isFirstPass = true;
							
            combobox.loadData( this.options.process( data ) );
			combobox.dropdown().control().draw( combobox.modelList );
			
			// lets see if new data had a selected item
			newSelectedValue = combobox.currentItem.value;
			if ( !newSelectedValue ) {
				// if it doesn't lets see if the new data has the pre-selected item
				var item = combobox.modelListMatches( "value", oldSelectedValue )[0];
				// if it does lets just select it
				if( item ) {
					combobox.val( oldSelectedValue );
				}
			}

			combobox.dropdown().control().show();
			combobox.options.overrideDropdown = false;
		
            this.dataAlreadyLoaded = true;
			if( callback ) {
				callback( combobox.modelList );
			}
        },
        loadDataFromServerError: function (response)
        {
            alert(response.responseText);
        }
    });

    });