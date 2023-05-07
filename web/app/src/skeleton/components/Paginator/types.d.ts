export interface PaginationSettings {
	/** Index of the first list item to display. */
	offset: number;
	/** Current number of items to display. */
	limit: number;
	/** The total size (length) of your source content. */
	size: number;
	/** List of amounts available to the select input */
	amounts: number[];
}
