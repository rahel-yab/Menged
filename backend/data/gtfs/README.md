# Addis Ababa minibus GTFS snapshot

This directory contains the minibus portion of the AddisMapTransit GTFS feed, downloaded on 2026-10-17 from the [AddisMapTransit GTFS repository](https://github.com/AddisMap/AddisMapTransit-gtfs).

The repository describes the feed as OpenStreetMap based, collected by AddisMap volunteers and updated weekly. The feed is distributed under the Open Database License (ODbL); attribution is due to OpenStreetMap contributors and AddisMapTransit. See the upstream repository's `LICENSE.md` for the full terms.

Menged uses the feed's route, stop, trip, stop-time, frequency, and shape records to build route suggestions and draw the mapped route geometry. This is a static snapshot: it does not provide live vehicle locations, seat availability, or confirmation that a minibus is operating at a particular time. The feed can contain mapping errors and should be confirmed locally before travel.
