<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    	@yield('title')
        @include('head')
        @yield('styles')
    </head>
    <body>
    	@yield('content')
    	@yield('scripts')
    </body>
</html>
