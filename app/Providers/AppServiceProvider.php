<?php

namespace App\Providers;

use App\Models\Services\BannedTopicsDetectorInterface;
use App\Models\Services\HardcodedListBannedTopicsDetector;
use App\Models\Services\SuperAIBannedTopicsDetector;
use Carbon\Carbon;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment() === 'production') {
            $this->app->bind(BannedTopicsDetectorInterface::class, SuperAIBannedTopicsDetector::class);
        } else {
            $this->app->bind(BannedTopicsDetectorInterface::class, HardcodedListBannedTopicsDetector::class);
        }

        if (env('LOG_ALL_QUERIES')) {
            DB::listen(function ($query) {
                $queryString = Str::replaceArray(
                    '?',
                    array_map(
                        function ($binding) {
                            if ($binding instanceof Carbon) {
                                $binding = $binding->toString();
                            }

                            return var_export($binding, return: true);
                        },
                        $query->bindings
                    ),
                    $query->sql
                );
                Log::debug($queryString);
            });
        }
    }
}
