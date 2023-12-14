/* global ONDTrackingConfig */

/**
 *
 */
//const ONDTracking = ( () => {
document.addEventListener("DOMContentLoaded",function(){
	'use strict';

	/** */
	const generateUUID = () => {
		let uuid = '', i, random;
		for ( i = 0; i < 32; i++ ) { // eslint-disable-line
			random = Math.random() * 16 | 0;

			if ( 8 == i || 12 == i || 16 == i || 20 == i ) {
				uuid += '-';
			}
			uuid += ( 12 == i ? 4 : ( 16 == i ? ( random & 3 | 8 ) : random ) ).toString( 16 );
		}

		return uuid;
	};

	/** */
	const getLandingPage = () => {
		const matches = document.cookie.match( /(?:; |^)odcUIDLandingPage=([^;]+)(?:; |$)/ );
		if ( null === matches ) {
			return null;
		}

		return matches[ 1 ];
	};

	/** */
	const setLandingPage = () => {
		const cookieDate = new Date( Date.now() + ( 60000 * 60 * 24 * 365 * 20 ) ).toUTCString(); // Add 20 years.
		document.cookie = `odcUIDLandingPage=${window.location}; domain=${ONDTrackingConfig.cookieDomain}; path=/; expires=${cookieDate}`;
	};

	/** */
	const getUserId = () => {
		const matches = document.cookie.match( /(?:; |^)odu=([^;]+)(?:; |$)/ );
		if ( null === matches ) {
			return null;
		}

		return matches[ 1 ];
	};

	/** */
	const getTrackingID = () => {
		const matches = document.cookie.match( /(?:; |^)odc_tracking_id=([^;]+)(?:; |$)/ );
		if ( null === matches ) {
			return null;
		}

		return matches[ 1 ];
	};

	/** */
	const setTrackingID = () => {
		const cookieDate = new Date( Date.now() + ( 60000 * 60 * 24 * 365 * 20 ) ).toUTCString(); // Add 20 years.
		const uuid = generateUUID();

		document.cookie = `odc_tracking_id=${uuid}; domain=${ONDTrackingConfig.cookieDomain}; path=/; expires=${cookieDate}`;
		return uuid;
	};

	const landingPage = getLandingPage();
	const userID = getUserId();
	let trackingID = getTrackingID();

	if ( null === landingPage ) {
		setLandingPage();
	}

	if ( null === trackingID ) {
		trackingID = setTrackingID();
	}

	if ( 'undefined' !== typeof window.mixpanel ) {
		window.mixpanel.register( {'Site': window.location.hostname} );
		window.mixpanel.people.set( {'UID': trackingID} );
		window.mixpanel.register( {'UID': trackingID} );
		window.mixpanel.identify( userID || trackingID );

		window.mixpanel.track( 'Loaded Page', {'Page': window.location.pathname, 'Url': window.location.href} );
	}

} );

//export default ONDTracking;
