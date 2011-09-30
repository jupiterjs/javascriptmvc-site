module('simplemodal test', { 
	setup: function(){
		S.open('//clui/simplemodal/simplemodal.html');
	}
});

test('Should match h1 on test page', function(){
	equals(S('h1').text(), 'clui/simplemodal', 'Should match h1 on test page');
});

test('Should set display:block on modal div', function(){
    S('#modal').hasClass('clui_simplemodal', true, function(){
        equals(S('#modal').css('display'), 'block', 'Should set display:block on modal div'); 
    });
});

test('Should add underlay', function(){
   S('#simpleModalUnderlay').exists(function(){
       ok('Should add underlay');
   })
});

test('Should set display:none on modal div when .cancel clicked', function(){
    S('#cancel').click({}, function(){
        S('#modal').css('display', 'none', function(){
            ok('Should set display:none on modal div when .cancel clicked');    
        })
    });
});

test('Should set display:none on underlay when .cancel clicked', function(){
    S('#cancel').click({}, function(){
        S('#simpleModalUnderlay').css('display', 'none', function(){
            ok('Should set display:none on underlay when .cancel clicked');    
        })
    });
});

test('Should set display:block on modal div when show clicked', function(){
    S('#cancel').click({}, function(){
        S('#show').click({}, function(){
            S('#modal').css('display', 'block', function(){
                ok('Should set display:block on modal div when show clicked');    
            });
        });
    });
});