<script lang="ts">
	export let path: string;
	export let size = '1em';
	export let color = 'currentColor';
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" {...$$restProps}>
	<path d={path} />
</svg>
