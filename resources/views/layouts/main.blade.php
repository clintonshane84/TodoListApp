<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    	@yield('title')
	    <!-- CSRF Token -->
		<meta name="csrf-token" content="{{ csrf_token() }}">
        @include('head')
        @yield('styles')
    </head>
    <body>
    	@yield('content')
    	@yield('scripts')
    </body>
</html>
