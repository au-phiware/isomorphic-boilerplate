import $ from 'jquery';
import 'bootstrap/js/modal';

if (IS_BROWSER) $('#welcome').modal();
else console.log(':(');
