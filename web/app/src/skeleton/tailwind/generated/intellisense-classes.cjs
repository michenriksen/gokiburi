module.exports = {
	'.hide-scrollbar::-webkit-scrollbar': { display: 'none' },
	'.hide-scrollbar': { msOverflowStyle: 'none', scrollbarWidth: 'none' },
	'.divider-vertical': {
		marginLeft: 'auto',
		marginRight: 'auto',
		display: 'inline-block',
		minHeight: '10px',
		borderLeftWidth: '1px',
		borderStyle: 'solid',
		borderColor: 'rgb(var(--color-surface-300))'
	},
	'.dark .divider-vertical': { borderColor: 'rgb(var(--color-surface-600))' },
	'.\\!legend': { fontSize: '1.25rem', lineHeight: '1.75rem', fontFamily: 'var(--theme-font-family-heading)' },
	'.legend': { fontSize: '1.25rem', lineHeight: '1.75rem', fontFamily: 'var(--theme-font-family-heading)' },
	'.label > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(0.25rem * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(0.25rem * var(--tw-space-y-reverse))'
	},
	'.\\!input': {
		width: '100%',
		transitionProperty:
			'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '200ms',
		backgroundColor: 'rgb(var(--color-surface-200))',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		borderWidth: 'var(--theme-border-base)',
		borderColor: 'rgb(var(--color-surface-400))',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.input,\n\t.textarea,\n\t.select,\n\t.input-group': {
		width: '100%',
		transitionProperty:
			'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '200ms',
		backgroundColor: 'rgb(var(--color-surface-200))',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		borderWidth: 'var(--theme-border-base)',
		borderColor: 'rgb(var(--color-surface-400))'
	},
	'.dark .\\!input': { backgroundColor: 'rgb(var(--color-surface-700))', borderColor: 'rgb(var(--color-surface-500))' },
	'.\\!input:hover': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.\\!input:focus': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.dark .input,.dark \n\t.textarea,.dark \n\t.select,.dark \n\t.input-group': {
		backgroundColor: 'rgb(var(--color-surface-700))',
		borderColor: 'rgb(var(--color-surface-500))'
	},
	'.input:hover,\n\t.textarea:hover,\n\t.select:hover,\n\t.input-group:hover': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.input:focus,\n\t.textarea:focus,\n\t.select:focus,\n\t.input-group:focus': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.\\!input:focus-within': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-primary-500) / var(--tw-border-opacity))'
	},
	'.input:focus-within,\n\t.textarea:focus-within,\n\t.select:focus-within,\n\t.input-group:focus-within': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-primary-500) / var(--tw-border-opacity))'
	},
	'.input,\n\t.input-group': { borderRadius: 'var(--theme-rounded-base)' },
	'.textarea,\n\t.select': { borderRadius: 'var(--theme-rounded-container)' },
	'.select > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(0.25rem * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(0.25rem * var(--tw-space-y-reverse))'
	},
	'.select': { padding: '0.5rem', paddingRight: '2rem' },
	'.select[size]': { backgroundImage: 'none' },
	'.select optgroup > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(0.25rem * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(0.25rem * var(--tw-space-y-reverse))'
	},
	'.select optgroup': { fontWeight: 700 },
	'.select optgroup option': { marginLeft: '0px', paddingLeft: '0px' },
	'.select optgroup option:first-of-type': { marginTop: '0.75rem' },
	'.select optgroup option:last-child': { marginBottom: '0.75rem !important' },
	'.select option': {
		cursor: 'pointer',
		paddingLeft: '1rem',
		paddingRight: '1rem',
		paddingTop: '0.5rem',
		paddingBottom: '0.5rem',
		backgroundColor: 'rgb(var(--color-surface-200))',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.dark .select option': { backgroundColor: 'rgb(var(--color-surface-700))' },
	'.select option:checked': {
		background:
			'rgb(var(--color-primary-500)) linear-gradient(0deg, rgb(var(--color-primary-500)) 0%, rgb(var(--color-primary-500)) 100%)',
		color: 'rgb(var(--on-primary))'
	},
	'.checkbox,\n\t.radio': {
		height: '1.25rem',
		width: '1.25rem',
		cursor: 'pointer',
		borderRadius: '0.25rem',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		backgroundColor: 'rgb(var(--color-surface-200))',
		borderWidth: 'var(--theme-border-base)',
		borderColor: 'rgb(var(--color-surface-400))'
	},
	'.dark .checkbox,.dark \n\t.radio': {
		backgroundColor: 'rgb(var(--color-surface-700))',
		borderColor: 'rgb(var(--color-surface-500))'
	},
	'.checkbox:hover,\n\t.radio:hover': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.checkbox:focus,\n\t.radio:focus': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-primary-500) / var(--tw-border-opacity))'
	},
	'.checkbox:checked,\n\t.radio:checked': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))'
	},
	'.checkbox:checked:hover,\n\t.radio:checked:hover': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))'
	},
	'.checkbox:checked:focus,\n\t.radio:checked:focus': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
	},
	'.radio': { borderRadius: 'var(--theme-rounded-base)' },
	".\\!input[type='file']": { padding: '0.25rem' },
	".input[type='file']": { padding: '0.25rem' },
	".\\!input[type='color']": {
		height: '2.5rem',
		width: '2.5rem',
		cursor: 'pointer',
		overflow: 'hidden',
		borderStyle: 'none',
		borderRadius: 'var(--theme-rounded-base)',
		WebkitAppearance: 'none !important'
	},
	".input[type='color']": {
		height: '2.5rem',
		width: '2.5rem',
		cursor: 'pointer',
		overflow: 'hidden',
		borderStyle: 'none',
		borderRadius: 'var(--theme-rounded-base)',
		WebkitAppearance: 'none'
	},
	".\\!input[type='color']::-webkit-color-swatch-wrapper": { padding: '0px' },
	".input[type='color']::-webkit-color-swatch-wrapper": { padding: '0px' },
	".\\!input[type='color']::-webkit-color-swatch": { borderStyle: 'none' },
	".\\!input[type='color']:hover::-webkit-color-swatch": {
		'--tw-brightness': 'brightness(1.1)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	".input[type='color']::-webkit-color-swatch": { borderStyle: 'none' },
	".input[type='color']:hover::-webkit-color-swatch": {
		'--tw-brightness': 'brightness(1.1)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	".\\!input[type='color']::-moz-color-swatch": { borderStyle: 'none' },
	".input[type='color']::-moz-color-swatch": { borderStyle: 'none' },
	'.\\!input:disabled': { cursor: 'not-allowed !important', opacity: '0.5 !important' },
	'.\\!input:disabled:hover': {
		'--tw-brightness': 'brightness(1) !important',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow) !important'
	},
	'.input:disabled,\n\t.textarea:disabled,\n\t.select:disabled': {
		cursor: 'not-allowed !important',
		opacity: '0.5 !important'
	},
	'.input:disabled:hover,\n\t.textarea:disabled:hover,\n\t.select:disabled:hover': {
		'--tw-brightness': 'brightness(1) !important',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow) !important'
	},
	'.\\!input[readonly]': { cursor: 'not-allowed !important', borderWidth: '0px !important' },
	'.\\!input[readonly]:hover': {
		'--tw-brightness': 'brightness(1) !important',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow) !important'
	},
	'.input[readonly],\n\t.textarea[readonly],\n\t.select[readonly]': {
		cursor: 'not-allowed !important',
		borderWidth: '0px !important'
	},
	'.input[readonly]:hover,\n\t.textarea[readonly]:hover,\n\t.select[readonly]:hover': {
		'--tw-brightness': 'brightness(1) !important',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow) !important'
	},
	'.input-group': { display: 'grid', overflow: 'hidden' },
	'.input-group input,\n\t.input-group select': {
		borderWidth: '0px',
		backgroundColor: 'transparent',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
	},
	'.input-group select option': { backgroundColor: 'rgb(var(--color-surface-200))' },
	'.dark .input-group select option': { backgroundColor: 'rgb(var(--color-surface-700))' },
	'.input-group div,\n\t.input-group a,\n\t.input-group button': {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: '1rem',
		paddingRight: '1rem'
	},
	'.input-group-divider input,\n\t.input-group-divider select,\n\t.input-group-divider div,\n\t.input-group-divider a':
		{
			borderLeftWidth: '1px',
			borderColor: 'rgb(var(--color-surface-400))',
			'--tw-ring-offset-shadow':
				'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
			'--tw-ring-shadow':
				'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
			boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
			minWidth: 'fit-content !important'
		},
	'.dark .input-group-divider input,.dark \n\t.input-group-divider select,.dark \n\t.input-group-divider div,.dark \n\t.input-group-divider a':
		{ borderColor: 'rgb(var(--color-surface-500))' },
	'.input-group-divider input:focus,\n\t.input-group-divider select:focus,\n\t.input-group-divider div:focus,\n\t.input-group-divider a:focus':
		{ borderColor: 'rgb(var(--color-surface-400))' },
	'.dark .input-group-divider input:focus,.dark \n\t.input-group-divider select:focus,.dark \n\t.input-group-divider div:focus,.dark \n\t.input-group-divider a:focus':
		{ borderColor: 'rgb(var(--color-surface-500))' },
	'.input-group-divider *:first-child': { borderLeftWidth: '0px !important' },
	'.input-group-shim': {
		backgroundColor: 'rgb(var(--color-surface-400) / 0.1)',
		color: 'rgb(var(--color-surface-600))'
	},
	'.dark .input-group-shim': { color: 'rgb(var(--color-surface-300))' },
	'.input-success': {
		'--tw-border-opacity': '1 !important',
		borderColor: 'rgb(var(--color-success-500) / var(--tw-border-opacity)) !important',
		'--tw-bg-opacity': '1 !important',
		backgroundColor: 'rgb(var(--color-success-200) / var(--tw-bg-opacity)) !important',
		'--tw-text-opacity': '1 !important',
		color: 'rgb(var(--color-success-700) / var(--tw-text-opacity)) !important'
	},
	'.input-success::-moz-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-success-700) / var(--tw-text-opacity))'
	},
	'.input-success:-ms-input-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-success-700) / var(--tw-text-opacity))'
	},
	'.input-success::placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-success-700) / var(--tw-text-opacity))'
	},
	'.input-warning': {
		'--tw-border-opacity': '1 !important',
		borderColor: 'rgb(var(--color-warning-500) / var(--tw-border-opacity)) !important',
		'--tw-bg-opacity': '1 !important',
		backgroundColor: 'rgb(var(--color-warning-200) / var(--tw-bg-opacity)) !important',
		'--tw-text-opacity': '1 !important',
		color: 'rgb(var(--color-warning-700) / var(--tw-text-opacity)) !important'
	},
	'.input-warning::-moz-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-warning-700) / var(--tw-text-opacity))'
	},
	'.input-warning:-ms-input-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-warning-700) / var(--tw-text-opacity))'
	},
	'.input-warning::placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-warning-700) / var(--tw-text-opacity))'
	},
	'.input-error': {
		'--tw-border-opacity': '1 !important',
		borderColor: 'rgb(var(--color-error-500) / var(--tw-border-opacity)) !important',
		'--tw-bg-opacity': '1 !important',
		backgroundColor: 'rgb(var(--color-error-200) / var(--tw-bg-opacity)) !important',
		'--tw-text-opacity': '1 !important',
		color: 'rgb(var(--color-error-500) / var(--tw-text-opacity)) !important'
	},
	'.input-error::-moz-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-error-500) / var(--tw-text-opacity))'
	},
	'.input-error:-ms-input-placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-error-500) / var(--tw-text-opacity))'
	},
	'.input-error::placeholder': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-error-500) / var(--tw-text-opacity))'
	},
	'.variant-form-material': {
		borderTopLeftRadius: '0.25rem !important',
		borderTopRightRadius: '0.25rem !important',
		borderBottomLeftRadius: '0px !important',
		borderBottomRightRadius: '0px !important',
		backgroundColor: 'rgb(var(--color-surface-500) / 0.1)',
		borderWidth: '0px',
		borderBottomWidth: '2px',
		'--tw-backdrop-blur': 'blur(8px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	".variant-form-material[type='file']": { paddingTop: '0.375rem !important', paddingBottom: '0.375rem !important' },
	'.alert': {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: '1rem',
		color: 'rgb(var(--color-surface-900))',
		borderRadius: 'var(--theme-rounded-container)'
	},
	'.alert > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(1rem * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(1rem * var(--tw-space-y-reverse))'
	},
	'.dark .alert': { color: 'rgb(var(--color-surface-50))' },
	'.alert-message': { flex: '1 1 auto' },
	'.alert-message > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(0.5rem * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(0.5rem * var(--tw-space-y-reverse))'
	},
	'.alert-actions': { display: 'flex', alignItems: 'center' },
	'.alert-actions > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.badge': {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		whiteSpace: 'nowrap',
		fontSize: '0.75rem',
		lineHeight: '1rem',
		fontWeight: 600,
		paddingLeft: '0.5rem',
		paddingRight: '0.5rem',
		paddingTop: '0.25rem',
		paddingBottom: '0.25rem',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.badge > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.badge-icon': {
		display: 'flex',
		height: '1.25rem',
		width: '1.25rem',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '9999px',
		fontSize: '0.75rem',
		lineHeight: '1rem',
		fontWeight: 600,
		'--tw-shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
		'--tw-shadow-colored': '0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)',
		boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)'
	},
	'.badge-glass': {
		backgroundColor: 'rgb(var(--color-surface-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-color': 'rgb(23 23 23 / 0.05)'
	},
	'.breadcrumb::-webkit-scrollbar,\n\t.breadcrumb-nonresponsive::-webkit-scrollbar': { display: 'none' },
	'.breadcrumb,\n\t.breadcrumb-nonresponsive': {
		msOverflowStyle: 'none',
		scrollbarWidth: 'none',
		display: 'flex',
		width: '100%',
		alignItems: 'center',
		overflowX: 'auto'
	},
	'.breadcrumb > :not([hidden]) ~ :not([hidden]),\n\t.breadcrumb-nonresponsive > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.crumb': { display: 'flex', alignItems: 'center', justifyContent: 'center' },
	'.crumb > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.crumb-separator': { display: 'flex', opacity: 0.5, color: 'rgb(var(--color-surface-700))' },
	'.dark .crumb-separator': { color: 'rgb(var(--color-surface-200))' },
	'.breadcrumb li': { display: 'none' },
	'.breadcrumb li:nth-last-child(3),\n\t.breadcrumb li:nth-last-child(2),\n\t.breadcrumb li:nth-last-child(1)': {
		display: 'block'
	},
	'.btn': {
		fontSize: '1rem',
		lineHeight: '1.5rem',
		paddingLeft: '1.25rem',
		paddingRight: '1.25rem',
		paddingTop: '9px',
		paddingBottom: '9px',
		whiteSpace: 'nowrap',
		textAlign: 'center',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.btn > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.btn:hover': {
		'--tw-brightness': 'brightness(1.15)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.btn:active': {
		'--tw-scale-x': '95%',
		'--tw-scale-y': '95%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
		'--tw-brightness': 'brightness(.9)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.btn-sm': {
		paddingLeft: '0.75rem',
		paddingRight: '0.75rem',
		paddingTop: '0.375rem',
		paddingBottom: '0.375rem',
		fontSize: '0.875rem',
		lineHeight: '1.25rem'
	},
	'.btn-lg': {
		paddingLeft: '1.75rem',
		paddingRight: '1.75rem',
		paddingTop: '0.75rem',
		paddingBottom: '0.75rem',
		fontSize: '1.125rem',
		lineHeight: '1.75rem'
	},
	'.btn-xl': {
		paddingLeft: '2.25rem',
		paddingRight: '2.25rem',
		paddingTop: '1rem',
		paddingBottom: '1rem',
		fontSize: '1.25rem',
		lineHeight: '1.75rem'
	},
	'.btn-icon': {
		fontSize: '1rem',
		lineHeight: '1.5rem',
		paddingLeft: '1.25rem',
		paddingRight: '1.25rem',
		paddingTop: '9px',
		paddingBottom: '9px',
		whiteSpace: 'nowrap',
		textAlign: 'center',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms',
		padding: '0px',
		aspectRatio: '1 / 1',
		width: '43px',
		borderRadius: '9999px'
	},
	'.btn-icon > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.btn-icon:hover': {
		'--tw-brightness': 'brightness(1.15)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.btn-icon-sm': { aspectRatio: '1 / 1', width: '33px', fontSize: '0.875rem', lineHeight: '1.25rem' },
	'.btn-icon-lg': { aspectRatio: '1 / 1', width: '53px', fontSize: '1.125rem', lineHeight: '1.75rem' },
	'.btn-icon-xl': { aspectRatio: '1 / 1', width: '63px', fontSize: '1.25rem', lineHeight: '1.75rem' },
	'.btn-group': {
		display: 'inline-flex',
		flexDirection: 'row',
		overflow: 'hidden',
		borderRadius: 'var(--theme-rounded-base)',
		isolation: 'isolate'
	},
	'.btn-group > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0px * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0px * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.btn-group-vertical': {
		display: 'inline-flex',
		flexDirection: 'column',
		overflow: 'hidden',
		borderRadius: 'var(--theme-rounded-container)',
		isolation: 'isolate'
	},
	'.btn-group-vertical > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0px * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0px * calc(1 - var(--tw-space-x-reverse)))',
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(0px * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(0px * var(--tw-space-y-reverse))'
	},
	'.btn-group-vertical button,.btn-group-vertical a': {
		fontSize: '1rem',
		lineHeight: '1.5rem',
		paddingLeft: '1.25rem',
		paddingRight: '1.25rem',
		paddingTop: '9px',
		paddingBottom: '9px',
		whiteSpace: 'nowrap',
		textAlign: 'center',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms',
		color: 'inherit !important',
		textDecorationLine: 'none !important'
	},
	'.btn-group-vertical button > :not([hidden]) ~ :not([hidden]),.btn-group-vertical a > :not([hidden]) ~ :not([hidden])':
		{
			'--tw-space-x-reverse': '0',
			marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
			marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
		},
	'.btn-group-vertical button:hover,.btn-group-vertical a:hover': {
		'--tw-brightness': 'brightness(1.15)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
		backgroundColor: 'rgb(var(--color-surface-50) / 3%)'
	},
	'.btn-group-vertical button:active,.btn-group-vertical a:active': {
		backgroundColor: 'rgb(var(--color-surface-900) / 3%)'
	},
	'.btn-group-vertical * + *': {
		borderTopWidth: '1px',
		borderLeftWidth: '0px',
		borderColor: 'rgb(var(--color-surface-500) / 0.2)'
	},
	'.btn-group button,\n\t.btn-group a,\n\t.btn-group-vertical button,\n\t.btn-group-vertical a': {
		fontSize: '1rem',
		lineHeight: '1.5rem',
		paddingLeft: '1.25rem',
		paddingRight: '1.25rem',
		paddingTop: '9px',
		paddingBottom: '9px',
		whiteSpace: 'nowrap',
		textAlign: 'center',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms',
		color: 'inherit !important',
		textDecorationLine: 'none !important'
	},
	'.btn-group button > :not([hidden]) ~ :not([hidden]),\n\t.btn-group a > :not([hidden]) ~ :not([hidden]),\n\t.btn-group-vertical button > :not([hidden]) ~ :not([hidden]),\n\t.btn-group-vertical a > :not([hidden]) ~ :not([hidden])':
		{
			'--tw-space-x-reverse': '0',
			marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
			marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
		},
	'.btn-group button:hover,\n\t.btn-group a:hover,\n\t.btn-group-vertical button:hover,\n\t.btn-group-vertical a:hover':
		{
			'--tw-brightness': 'brightness(1.15)',
			filter:
				'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
			backgroundColor: 'rgb(var(--color-surface-50) / 3%)'
		},
	'.btn-group button:active,\n\t.btn-group a:active,\n\t.btn-group-vertical button:active,\n\t.btn-group-vertical a:active':
		{ backgroundColor: 'rgb(var(--color-surface-900) / 3%)' },
	'.btn-group * + *': {
		borderTopWidth: '0px',
		borderLeftWidth: '1px',
		borderColor: 'rgb(var(--color-surface-500) / 0.2)'
	},
	'.card': {
		backgroundColor: 'rgb(var(--color-surface-100))',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-color': 'rgb(23 23 23 / 0.05);',
		borderRadius: 'var(--theme-rounded-container)'
	},
	'.dark .card': {
		backgroundColor: 'rgb(var(--color-surface-800))',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-color': 'rgb(250 250 250 / 0.05)'
	},
	'.card-header': { padding: '1rem', paddingBottom: '0px' },
	'.card-footer': { padding: '1rem', paddingTop: '0px' },
	'.card-hover': {
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms'
	},
	'.card-hover:hover': {
		'--tw-scale-x': '101%',
		'--tw-scale-y': '101%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
		'--tw-shadow': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
		'--tw-shadow-colored': '0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color)',
		boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)'
	},
	'.chip': {
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		paddingLeft: '0.75rem',
		paddingRight: '0.75rem',
		paddingTop: '0.375rem',
		paddingBottom: '0.375rem',
		textAlign: 'center',
		fontSize: '0.75rem',
		lineHeight: '1rem',
		borderRadius: '0.25rem',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms'
	},
	'.chip > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(0.5rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.chip:hover': {
		'--tw-brightness': 'brightness(1.15)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.chip-disabled,\n\t.chip:disabled': { cursor: 'not-allowed !important', opacity: '0.5 !important' },
	'.chip-disabled:active,\n\t.chip:disabled:active': {
		'--tw-scale-x': '1',
		'--tw-scale-y': '1',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.list,\n\t.list-dl,\n\t.list-nav ul': { listStyleType: 'none' },
	'.list > :not([hidden]) ~ :not([hidden]),\n\t.list-dl > :not([hidden]) ~ :not([hidden]),\n\t.list-nav ul > :not([hidden]) ~ :not([hidden])':
		{
			'--tw-space-y-reverse': '0',
			marginTop: 'calc(0.25rem * calc(1 - var(--tw-space-y-reverse)))',
			marginBottom: 'calc(0.25rem * var(--tw-space-y-reverse))'
		},
	'.list li': {
		display: 'flex',
		alignItems: 'center',
		padding: '0.5rem',
		borderRadius: 'var(--theme-rounded-base)',
		whiteSpace: 'normal',
		overflowWrap: 'break-word'
	},
	'.list li > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.list-dl div': {
		display: 'flex',
		alignItems: 'center',
		whiteSpace: 'nowrap',
		padding: '0.5rem',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.list-dl div > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.list-nav a,\n\t.list-nav button,\n\t.list-option': {
		display: 'flex',
		alignItems: 'center',
		whiteSpace: 'nowrap',
		paddingLeft: '1rem',
		paddingRight: '1rem',
		paddingTop: '0.5rem',
		paddingBottom: '0.5rem',
		outline: '2px solid transparent',
		outlineOffset: '2px',
		cursor: 'pointer',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.list-nav a > :not([hidden]) ~ :not([hidden]),\n\t.list-nav button > :not([hidden]) ~ :not([hidden]),\n\t.list-option > :not([hidden]) ~ :not([hidden])':
		{
			'--tw-space-x-reverse': '0',
			marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
			marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))'
		},
	'.list-nav a:hover,\n\t.list-nav button:hover,\n\t.list-option:hover': {
		backgroundColor: 'rgb(var(--color-primary-500) / 0.1)'
	},
	'.list-nav a:focus,\n\t.list-nav button:focus,\n\t.list-option:focus': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-primary))'
	},
	'.logo-cloud': { display: 'grid', overflow: 'hidden', borderRadius: 'var(--theme-rounded-container)' },
	'.logo-item': {
		'@apply: flex-auto text-center space-x-4 shadow': true,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgb(var(--color-surface-100))',
		fontSize: '1rem',
		lineHeight: '1.5rem',
		fontWeight: 700,
		'--tw-text-opacity': '1',
		color: 'rgb(0 0 0 / var(--tw-text-opacity))',
		paddingTop: '1rem',
		paddingBottom: '1rem'
	},
	'.logo-item > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-x-reverse': '0',
		marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
		marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))'
	},
	'.dark .logo-item': { backgroundColor: 'rgb(var(--color-surface-800))' },
	'.placeholder': {
		height: '1.25rem',
		backgroundColor: 'rgb(var(--color-surface-300))',
		borderRadius: 'var(--theme-rounded-base)'
	},
	'.dark .placeholder': { backgroundColor: 'rgb(var(--color-surface-600))' },
	'.placeholder-circle': {
		aspectRatio: '1 / 1',
		borderRadius: '9999px',
		backgroundColor: 'rgb(var(--color-surface-300))'
	},
	'.dark .placeholder-circle': { backgroundColor: 'rgb(var(--color-surface-600))' },
	'.table-container': { width: '100%', overflowX: 'auto', borderRadius: 'var(--theme-rounded-container)' },
	'.dark .table': { backgroundColor: 'rgb(var(--color-surface-800))' },
	'.table-hover tbody tr:hover': { backgroundColor: 'rgb(var(--color-surface-500) / 0.2)' },
	'.table-hover tbody tr:hover:nth-child(even)': { backgroundColor: 'rgb(var(--color-surface-500) / 0.2)' },
	'.table-interactive tbody tr': { cursor: 'pointer' },
	'.table-interactive tbody tr:hover:hover': { backgroundColor: 'rgb(var(--color-primary-500) / 0.1)' },
	'.table-interactive tbody tr:hover:nth-child(even):hover': { backgroundColor: 'rgb(var(--color-primary-500) / 0.1)' },
	'.table-sort-asc::after': { opacity: 0.5, '--tw-content': "'↑' !important", content: 'var(--tw-content) !important' },
	'.table-sort-dsc::after': { opacity: 0.5, '--tw-content': "'↓' !important", content: 'var(--tw-content) !important' },
	'.table thead': {
		borderBottomWidth: '1px',
		borderColor: 'rgb(var(--color-surface-500) / 0.2)',
		backgroundColor: 'rgb(var(--color-surface-200))'
	},
	'.dark .table thead': { backgroundColor: 'rgb(var(--color-surface-700))' },
	'.table thead tr': { textAlign: 'left', textTransform: 'capitalize' },
	'.table thead th': { padding: '1rem', fontWeight: 700 },
	'.table tbody tr': { borderBottomWidth: '1px', borderColor: 'rgb(var(--color-surface-500) / 0.2)' },
	'.table tbody tr:nth-child(even)': { backgroundColor: 'rgb(var(--color-surface-500) / 0.05)' },
	'.table tbody td': {
		whiteSpace: 'nowrap',
		paddingLeft: '0.75rem',
		paddingRight: '0.75rem',
		paddingTop: '1rem',
		paddingBottom: '1rem',
		verticalAlign: 'top',
		fontSize: '0.875rem',
		lineHeight: '1.25rem'
	},
	'.table-compact tbody td': { paddingTop: '0.75rem !important', paddingBottom: '0.75rem !important' },
	'.table-comfortable tbody td': { paddingTop: '1.25rem !important', paddingBottom: '1.25rem !important' },
	'.table tfoot': { backgroundColor: 'rgb(var(--color-surface-100))' },
	'.dark .table tfoot': { backgroundColor: 'rgb(var(--color-surface-800))' },
	'.table tfoot tr': { textAlign: 'left', textTransform: 'capitalize' },
	'.table tfoot th,\n\t.table tfoot td': { padding: '1rem' },
	'.table-row-checked': { backgroundColor: 'rgb(var(--color-secondary-500) / 0.2) !important' },
	'.table-cell-fit': { width: '1%', whiteSpace: 'nowrap' },
	'.variant-filled': { backgroundColor: 'rgb(var(--color-surface-900))', color: 'rgb(var(--color-surface-50))' },
	'.dark .variant-filled': { backgroundColor: 'rgb(var(--color-surface-50))', color: 'rgb(var(--color-surface-900))' },
	'.variant-filled-primary': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-primary))'
	},
	'.variant-filled-secondary': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-secondary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-secondary))'
	},
	'.variant-filled-tertiary': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-tertiary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-tertiary))'
	},
	'.variant-filled-success': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-success-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-success))'
	},
	'.variant-filled-warning': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-warning-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-warning))'
	},
	'.variant-filled-error': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-error-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-error))'
	},
	'.variant-filled-surface': { backgroundColor: 'rgb(var(--color-surface-400))', color: 'rgb(var(--on-surface))' },
	'.dark .variant-filled-surface': { backgroundColor: 'rgb(var(--color-surface-500))' },
	'.variant-ringed': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-surface-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-primary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-primary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-secondary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-secondary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-tertiary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-tertiary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-success': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-success-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-warning': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-warning-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-error': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-error-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ringed-surface': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-surface-500) / var(--tw-ring-opacity))',
		backgroundColor: 'transparent'
	},
	'.variant-ghost-primary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-primary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-primary-500) / 0.2)'
	},
	'.variant-ghost-secondary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-secondary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-secondary-500) / 0.2)'
	},
	'.variant-ghost-tertiary': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-tertiary-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-tertiary-500) / 0.2)'
	},
	'.variant-ghost-success': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-success-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-success-500) / 0.2)'
	},
	'.variant-ghost-warning': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-warning-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-warning-500) / 0.2)'
	},
	'.variant-ghost-error': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-error-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-error-500) / 0.2)'
	},
	'.variant-ghost,\n\t.variant-ghost-surface': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-opacity': '1',
		'--tw-ring-color': 'rgb(var(--color-surface-500) / var(--tw-ring-opacity))',
		backgroundColor: 'rgb(var(--color-surface-500) / 0.2)'
	},
	'.variant-soft-primary': {
		backgroundColor: 'rgb(var(--color-primary-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-primary-700))'
	},
	'.dark .variant-soft-primary': { color: 'rgb(var(--color-primary-200))' },
	'.variant-soft-secondary': {
		backgroundColor: 'rgb(var(--color-secondary-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-secondary-700))'
	},
	'.dark .variant-soft-secondary': { color: 'rgb(var(--color-secondary-200))' },
	'.variant-soft-tertiary': {
		backgroundColor: 'rgb(var(--color-tertiary-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-tertiary-700))'
	},
	'.dark .variant-soft-tertiary': { color: 'rgb(var(--color-tertiary-200))' },
	'.variant-soft-success': {
		backgroundColor: 'rgb(var(--color-success-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-success-700))'
	},
	'.dark .variant-soft-success': { color: 'rgb(var(--color-success-200))' },
	'.variant-soft-warning': {
		backgroundColor: 'rgb(var(--color-warning-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-warning-700))'
	},
	'.dark .variant-soft-warning': { color: 'rgb(var(--color-warning-200))' },
	'.variant-soft-error': {
		backgroundColor: 'rgb(var(--color-error-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-error-700))'
	},
	'.dark .variant-soft-error': { color: 'rgb(var(--color-error-200))' },
	'.variant-soft,\n\t.variant-soft-surface': {
		backgroundColor: 'rgb(var(--color-surface-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-surface-700))'
	},
	'.dark .variant-soft,.dark \n\t.variant-soft-surface': { color: 'rgb(var(--color-surface-200))' },
	'.variant-glass-primary': {
		backgroundColor: 'rgb(var(--color-primary-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-secondary': {
		backgroundColor: 'rgb(var(--color-secondary-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-tertiary': {
		backgroundColor: 'rgb(var(--color-tertiary-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-success': {
		backgroundColor: 'rgb(var(--color-success-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-warning': {
		backgroundColor: 'rgb(var(--color-warning-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-error': {
		backgroundColor: 'rgb(var(--color-error-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass-surface': {
		backgroundColor: 'rgb(var(--color-surface-500) / 0.2)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.variant-glass': {
		backgroundColor: 'rgb(var(--color-surface-50) / 0.3)',
		'--tw-backdrop-blur': 'blur(16px)',
		backdropFilter:
			'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)'
	},
	'.left-\\[10\\%\\]': { left: '10%' },
	'.left-\\[15\\%\\]': { left: '15%' },
	'.left-\\[25\\%\\]': { left: '25%' },
	'.left-\\[35\\%\\]': { left: '35%' },
	'.left-\\[40\\%\\]': { left: '40%' },
	'.left-\\[45\\%\\]': { left: '45%' },
	'.left-\\[5\\%\\]': { left: '5%' },
	'.left-\\[50\\%\\]': { left: '50%' },
	'.left-\\[65\\%\\]': { left: '65%' },
	'.left-\\[70\\%\\]': { left: '70%' },
	'.top-\\[-12\\%\\]': { top: '-12%' },
	'.top-\\[0\\%\\]': { top: '0%' },
	'.top-\\[20\\%\\]': { top: '20%' },
	'.top-\\[32\\%\\]': { top: '32%' },
	'.top-\\[45\\%\\]': { top: '45%' },
	'.top-\\[50\\%\\]': { top: '50%' },
	'.top-\\[55\\%\\]': { top: '55%' },
	'.top-\\[60\\%\\]': { top: '60%' },
	'.top-\\[78\\%\\]': { top: '78%' },
	'.top-\\[98\\%\\]': { top: '98%' },
	'.z-\\[-1\\]': { zIndex: -1 },
	'.z-\\[1\\]': { zIndex: 1 },
	'.z-\\[888\\]': { zIndex: 888 },
	'.z-\\[999\\]': { zIndex: 999 },
	'.\\!my-6': { marginTop: '1.5rem !important', marginBottom: '1.5rem !important' },
	'.-mt-\\[15px\\]': { marginTop: '-15px' },
	'.mt-\\[15px\\]': { marginTop: '15px' },
	'.\\!flex': { display: 'flex !important' },
	'.aspect-\\[21\\/9\\]': { aspectRatio: '21/9' },
	'.h-\\[120px\\]': { height: '120px' },
	'.h-\\[20px\\]': { height: '20px' },
	'.h-\\[280px\\]': { height: '280px' },
	'.h-\\[480px\\]': { height: '480px' },
	'.h-\\[50\\%\\]': { height: '50%' },
	'.h-\\[72px\\]': { height: '72px' },
	'.max-h-\\[180px\\]': { maxHeight: '180px' },
	'.max-h-\\[200px\\]': { maxHeight: '200px' },
	'.max-h-\\[480px\\]': { maxHeight: '480px' },
	'.max-h-\\[90\\%\\]': { maxHeight: '90%' },
	'.min-h-\\[320px\\]': { minHeight: '320px' },
	'.min-h-\\[400px\\]': { minHeight: '400px' },
	'.\\!w-full': { width: '100% !important' },
	'.w-\\[100px\\]': { width: '100px' },
	'.w-\\[240px\\]': { width: '240px' },
	'.w-\\[280px\\]': { width: '280px' },
	'.w-\\[286px\\]': { width: '286px' },
	'.w-\\[320px\\]': { width: '320px' },
	'.w-\\[32px\\]': { width: '32px' },
	'.w-\\[360px\\]': { width: '360px' },
	'.w-\\[50\\%\\]': { width: '50%' },
	'.w-\\[70\\%\\]': { width: '70%' },
	'.w-\\[70px\\]': { width: '70px' },
	'.w-\\[90\\%\\]': { width: '90%' },
	'.min-w-\\[150px\\]': { minWidth: '150px' },
	'.max-w-\\[180px\\]': { maxWidth: '180px' },
	'.max-w-\\[320px\\]': { maxWidth: '320px' },
	'.max-w-\\[400px\\]': { maxWidth: '400px' },
	'.max-w-\\[475px\\]': { maxWidth: '475px' },
	'.max-w-\\[480px\\]': { maxWidth: '480px' },
	'.max-w-\\[600px\\]': { maxWidth: '600px' },
	'.max-w-\\[640px\\]': { maxWidth: '640px' },
	'.max-w-\\[650px\\]': { maxWidth: '650px' },
	'.max-w-\\[800px\\]': { maxWidth: '800px' },
	'.max-w-\\[90\\%\\]': { maxWidth: '90%' },
	'.origin-\\[50\\%_50\\%\\]': { transformOrigin: '50% 50%' },
	'.-translate-x-\\[50\\%\\]': {
		'--tw-translate-x': '-50%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.-translate-y-\\[50\\%\\]': {
		'--tw-translate-y': '-50%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.translate-x-\\[100\\%\\]': {
		'--tw-translate-x': '100%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.translate-x-\\[50\\%\\]': {
		'--tw-translate-x': '50%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.scale-\\[0\\.8\\]': {
		'--tw-scale-x': '0.8',
		'--tw-scale-y': '0.8',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.-scale-x-\\[100\\%\\]': {
		'--tw-scale-x': '-100%',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.grid-cols-\\[100px_1fr\\]': { gridTemplateColumns: '100px 1fr' },
	'.grid-cols-\\[1fr_auto\\]': { gridTemplateColumns: '1fr auto' },
	'.grid-cols-\\[1fr_auto_auto\\]': { gridTemplateColumns: '1fr auto auto' },
	'.grid-cols-\\[auto_1fr\\]': { gridTemplateColumns: 'auto 1fr' },
	'.grid-cols-\\[auto_1fr_auto\\]': { gridTemplateColumns: 'auto 1fr auto' },
	'.grid-rows-\\[1fr_40px\\]': { gridTemplateRows: '1fr 40px' },
	'.grid-rows-\\[auto_1fr_auto\\]': { gridTemplateRows: 'auto 1fr auto' },
	'.space-y-\\[1px\\] > :not([hidden]) ~ :not([hidden])': {
		'--tw-space-y-reverse': '0',
		marginTop: 'calc(1px * calc(1 - var(--tw-space-y-reverse)))',
		marginBottom: 'calc(1px * var(--tw-space-y-reverse))'
	},
	'.\\!rounded-none': { borderRadius: '0px !important' },
	'.rounded-\\[corner\\]': { borderRadius: 'corner' },
	'.\\!border-t-2': { borderTopWidth: '2px !important' },
	'.\\!border-t-4': { borderTopWidth: '4px !important' },
	'.\\!border-t-8': { borderTopWidth: '8px !important' },
	'.\\!border-dashed': { borderStyle: 'dashed !important' },
	'.\\!border-dotted': { borderStyle: 'dotted !important' },
	'.\\!border-double': { borderStyle: 'double !important' },
	'.border-primary-500': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-primary-500) / var(--tw-border-opacity))'
	},
	'.border-primary-500\\/50': { borderColor: 'rgb(var(--color-primary-500) / 0.5)' },
	'.border-secondary-500': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-secondary-500) / var(--tw-border-opacity))'
	},
	'.border-surface-500': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(var(--color-surface-500) / var(--tw-border-opacity))'
	},
	'.border-surface-500\\/10': { borderColor: 'rgb(var(--color-surface-500) / 0.1)' },
	'.border-surface-500\\/30': { borderColor: 'rgb(var(--color-surface-500) / 0.3)' },
	'.border-surface-500\\/50': { borderColor: 'rgb(var(--color-surface-500) / 0.5)' },
	'.from-primary-500': {
		'--tw-gradient-from': 'rgb(var(--color-primary-500) / 1) var(--tw-gradient-from-position)',
		'--tw-gradient-from-position': ' ',
		'--tw-gradient-to': 'rgb(var(--color-primary-500) / 0)  var(--tw-gradient-from-position)',
		'--tw-gradient-to-position': ' ',
		'--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
	},
	'.via-tertiary-500': {
		'--tw-gradient-via-position': ' ',
		'--tw-gradient-to': 'rgb(var(--color-tertiary-500) / 0)  var(--tw-gradient-to-position)',
		'--tw-gradient-to-position': ' ',
		'--tw-gradient-stops':
			'var(--tw-gradient-from), rgb(var(--color-tertiary-500) / 1) var(--tw-gradient-via-position), var(--tw-gradient-to)'
	},
	'.to-secondary-500': {
		'--tw-gradient-to': 'rgb(var(--color-secondary-500) / 1) var(--tw-gradient-to-position)',
		'--tw-gradient-to-position': ' '
	},
	'.fill-primary-500': { fill: 'rgb(var(--color-primary-500) / 1)' },
	'.fill-surface-50': { fill: 'rgb(var(--color-surface-50) / 1)' },
	'.fill-surface-900': { fill: 'rgb(var(--color-surface-900) / 1)' },
	'.stroke-error-500': { stroke: 'rgb(var(--color-error-500) / 1)' },
	'.stroke-error-500\\/30': { stroke: 'rgb(var(--color-error-500) / 0.3)' },
	'.stroke-primary-500': { stroke: 'rgb(var(--color-primary-500) / 1)' },
	'.stroke-primary-500\\/30': { stroke: 'rgb(var(--color-primary-500) / 0.3)' },
	'.stroke-secondary-500': { stroke: 'rgb(var(--color-secondary-500) / 1)' },
	'.stroke-secondary-500\\/30': { stroke: 'rgb(var(--color-secondary-500) / 0.3)' },
	'.stroke-success-500': { stroke: 'rgb(var(--color-success-500) / 1)' },
	'.stroke-success-500\\/30': { stroke: 'rgb(var(--color-success-500) / 0.3)' },
	'.stroke-surface-300': { stroke: 'rgb(var(--color-surface-300) / 1)' },
	'.stroke-surface-500\\/30': { stroke: 'rgb(var(--color-surface-500) / 0.3)' },
	'.stroke-surface-900': { stroke: 'rgb(var(--color-surface-900) / 1)' },
	'.stroke-tertiary-500': { stroke: 'rgb(var(--color-tertiary-500) / 1)' },
	'.stroke-tertiary-500\\/30': { stroke: 'rgb(var(--color-tertiary-500) / 0.3)' },
	'.stroke-warning-500': { stroke: 'rgb(var(--color-warning-500) / 1)' },
	'.stroke-warning-500\\/30': { stroke: 'rgb(var(--color-warning-500) / 0.3)' },
	'.\\!p-0': { padding: '0px !important' },
	'.\\!p-4': { padding: '1rem !important' },
	'.\\!px-3': { paddingLeft: '0.75rem !important', paddingRight: '0.75rem !important' },
	'.\\!text-center': { textAlign: 'center !important' },
	'.\\!text-5xl': { fontSize: '3rem !important', lineHeight: '1 !important' },
	'.\\!text-lg': { fontSize: '1.125rem !important', lineHeight: '1.75rem !important' },
	'.\\!text-sm': { fontSize: '0.875rem !important', lineHeight: '1.25rem !important' },
	'.\\!text-xl': { fontSize: '1.25rem !important', lineHeight: '1.75rem !important' },
	'.text-\\[16px\\]': { fontSize: '16px' },
	'.\\!text-current': { color: 'currentColor !important' },
	'.\\!text-slate-900': {
		'--tw-text-opacity': '1 !important',
		color: 'rgb(15 23 42 / var(--tw-text-opacity)) !important'
	},
	'.\\!text-stone-900': {
		'--tw-text-opacity': '1 !important',
		color: 'rgb(28 25 23 / var(--tw-text-opacity)) !important'
	},
	'.\\!text-white': {
		'--tw-text-opacity': '1 !important',
		color: 'rgb(255 255 255 / var(--tw-text-opacity)) !important'
	},
	'.\\!text-zinc-900': {
		'--tw-text-opacity': '1 !important',
		color: 'rgb(24 24 27 / var(--tw-text-opacity)) !important'
	},
	'.text-primary-500': { '--tw-text-opacity': '1', color: 'rgb(var(--color-primary-500) / var(--tw-text-opacity))' },
	'.text-primary-700': { '--tw-text-opacity': '1', color: 'rgb(var(--color-primary-700) / var(--tw-text-opacity))' },
	'.text-secondary-500': {
		'--tw-text-opacity': '1',
		color: 'rgb(var(--color-secondary-500) / var(--tw-text-opacity))'
	},
	'.text-surface-50': { '--tw-text-opacity': '1', color: 'rgb(var(--color-surface-50) / var(--tw-text-opacity))' },
	'.text-surface-700': { '--tw-text-opacity': '1', color: 'rgb(var(--color-surface-700) / var(--tw-text-opacity))' },
	'.text-surface-900': { '--tw-text-opacity': '1', color: 'rgb(var(--color-surface-900) / var(--tw-text-opacity))' },
	'.text-warning-500': { '--tw-text-opacity': '1', color: 'rgb(var(--color-warning-500) / var(--tw-text-opacity))' },
	'.accent-\\[color\\]': { accentColor: 'color' },
	'.accent-surface-900': { accentColor: 'rgb(var(--color-surface-900) / 1)' },
	'.shadow-surface-500\\/10': {
		'--tw-shadow-color': 'rgb(var(--color-surface-500) / 0.1)',
		'--tw-shadow': 'var(--tw-shadow-colored)'
	},
	'.-outline-offset-\\[3px\\]': { outlineOffset: '-3px' },
	'.\\!ring-0': {
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important'
	},
	'.ring-\\[1px\\]': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
	},
	'.ring-surface-500\\/10': { '--tw-ring-color': 'rgb(var(--color-surface-500) / 0.1)' },
	'.ring-surface-500\\/30': { '--tw-ring-color': 'rgb(var(--color-surface-500) / 0.3)' },
	'.ring-surface-500\\/50': { '--tw-ring-color': 'rgb(var(--color-surface-500) / 0.5)' },
	'.blur-\\[50px\\]': {
		'--tw-blur': 'blur(50px)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.transition-\\[stroke-dashoffset\\]': {
		transitionProperty: 'stroke-dashoffset',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms'
	},
	'.transition-\\[width\\]': {
		transitionProperty: 'width',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms'
	},
	'.duration-\\[200ms\\]': { transitionDuration: '200ms' },
	'.hover\\:card:hover': {
		backgroundColor: 'rgb(var(--color-surface-100))',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-color': 'rgb(23 23 23 / 0.05);',
		borderRadius: 'var(--theme-rounded-container)'
	},
	'.dark .hover\\:card:hover': {
		backgroundColor: 'rgb(var(--color-surface-800))',
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
		'--tw-ring-inset': 'inset',
		'--tw-ring-color': 'rgb(250 250 250 / 0.05)'
	},
	'.hover\\:card:hovera': {
		transitionProperty: 'all',
		transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
		transitionDuration: '150ms'
	},
	'.hover\\:card:hovera:hover': {
		'--tw-brightness': 'brightness(1.05)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.hover\\:variant-filled:hover': {
		backgroundColor: 'rgb(var(--color-surface-900))',
		color: 'rgb(var(--color-surface-50))'
	},
	'.dark .hover\\:variant-filled:hover': {
		backgroundColor: 'rgb(var(--color-surface-50))',
		color: 'rgb(var(--color-surface-900))'
	},
	'.hover\\:variant-soft-primary:hover': {
		backgroundColor: 'rgb(var(--color-primary-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-primary-700))'
	},
	'.dark .hover\\:variant-soft-primary:hover': { color: 'rgb(var(--color-primary-200))' },
	'.hover\\:variant-soft:hover': {
		backgroundColor: 'rgb(var(--color-surface-400) / 0.2)',
		'--tw-ring-offset-shadow':
			'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color) !important',
		'--tw-ring-shadow':
			'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color) !important',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000) !important',
		color: 'rgb(var(--color-surface-700))'
	},
	'.dark .hover\\:variant-soft:hover': { color: 'rgb(var(--color-surface-200))' },
	'.focus\\:\\!variant-filled-primary:focus': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-primary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-primary))'
	},
	'.\\[\\&\\>\\.logo-item\\]\\:variant-filled-secondary>.logo-item': {
		'--tw-bg-opacity': '1',
		backgroundColor: 'rgb(var(--color-secondary-500) / var(--tw-bg-opacity))',
		color: 'rgb(var(--on-secondary))'
	},
	'.hover\\:scale-105:hover': {
		'--tw-scale-x': '1.05',
		'--tw-scale-y': '1.05',
		transform:
			'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))'
	},
	'.hover\\:\\!border-primary-500:hover': {
		'--tw-border-opacity': '1 !important',
		borderColor: 'rgb(var(--color-primary-500) / var(--tw-border-opacity)) !important'
	},
	'.hover\\:ring-surface-500\\/50:hover': { '--tw-ring-color': 'rgb(var(--color-surface-500) / 0.5)' },
	'.hover\\:brightness-\\[105\\%\\]:hover': {
		'--tw-brightness': 'brightness(105%)',
		filter:
			'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)'
	},
	'.focus\\:ring-0:focus': {
		'--tw-ring-offset-shadow': 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
		'--tw-ring-shadow': 'var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color)',
		boxShadow: 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'
	},
	'.disabled\\:\\!opacity-0:disabled': { opacity: '0 !important' },
	'.\\[\\&\\>\\*\\+\\*\\]\\:border-red-500>*+*': {
		'--tw-border-opacity': '1',
		borderColor: 'rgb(239 68 68 / var(--tw-border-opacity))'
	},
	'.\\[\\&\\>\\.foo-label\\]\\:p-4>.foo-label': { padding: '1rem' },
	'.w-modal-slim': { width: '100%', maxWidth: '400px' },
	'.w-modal': { width: '100%', maxWidth: '640px' },
	'.w-modal-wide': { width: '100%', maxWidth: '80%' }
};
