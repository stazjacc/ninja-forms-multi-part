<?php

add_action( 'init', 'ninja_forms_register_mp_remove_save' );
function ninja_forms_register_mp_remove_save(){
	global $ninja_forms_processing;
	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'ajax' ) != 1 ){
		add_action( 'ninja_forms_before_pre_process', 'ninja_forms_mp_remove_save', 9 );
	}
}

function ninja_forms_mp_check_page_conditional_before_pre_process(){
	global $ninja_forms_processing;
	$form_id = $ninja_forms_processing->get_form_ID();
	$form_row = ninja_forms_get_form_by_id( $form_id );
	if ( isset ( $form_row['data']['multi_part'] ) AND $form_row['data']['multi_part'] == 1 ) {
		if( isset( $form_row['data']['ajax'] ) AND $form_row['data']['ajax'] == 1 ){
			if( function_exists( 'ninja_forms_conditionals_field_filter')  ){
				
				$pages = ninja_forms_mp_get_pages( $form_id );
				if( is_array( $pages ) AND !empty( $pages ) ){
					foreach( $pages as $page => $fields ){
						$show = ninja_forms_mp_check_page_conditional( $form_id, $page );
						if( !$show ){
							ninja_forms_mp_conditional_remove_page( $form_id, $page );
						}
					}
				}
			}		
		}		
	}
}

add_action( 'ninja_forms_before_pre_process', 'ninja_forms_mp_check_page_conditional_before_pre_process' );


function ninja_forms_mp_remove_save(){
	global $ninja_forms_processing, $ninja_forms_fields;

	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'multi_part' ) == 1 ){
		$nav = ninja_forms_mp_breadcrumb_update_current_page();

		if( $ninja_forms_processing->get_extra_value( '_prev' ) ){
			$nav = 'prev';
		}

		if( $ninja_forms_processing->get_extra_value( '_next' ) ){
			$nav = 'next';
		}

		if( $nav != '' ){
			remove_action( 'ninja_forms_pre_process', 'ninja_forms_req_fields_process', 13 );
			$ninja_forms_processing->set_action( 'mp_save' );
			remove_action( 'ninja_forms_post_process', 'ninja_forms_save_sub' );
		}
	}
	
}

add_action( 'init', 'ninja_forms_mp_register_save_page' );
function ninja_forms_mp_register_save_page(){
	global $ninja_forms_processing;

	if( is_object( $ninja_forms_processing ) AND $ninja_forms_processing->get_form_setting( 'ajax' ) != 1 ){
		add_action( 'ninja_forms_pre_process', 'ninja_forms_mp_save_page', 12 );
		add_action( 'ninja_forms_edit_sub_pre_process', 'ninja_forms_mp_save_page', 1001 );		
	}
	add_action( 'ninja_forms_pre_process', 'ninja_forms_mp_error_change_page', 20 );
}

function ninja_forms_mp_error_change_page(){
	global $ninja_forms_processing;
	//print_r( $ninja_forms_processing->get_all_fields() );
	if( $ninja_forms_processing->get_action() == 'submit'AND $ninja_forms_processing->get_form_setting( 'multi_part' ) == 1 ){
		
		if( $ninja_forms_processing->get_all_errors() ){
			$form_id = $ninja_forms_processing->get_form_ID();
			$pages = ninja_forms_mp_get_pages( $form_id );
			$all_fields = ninja_forms_get_fields_by_form_id( $form_id );
			$error_page = '';
			foreach( $all_fields as $field ){
				$field_id = $field['id'];
				if( $ninja_forms_processing->get_errors_by_location( $field_id ) ){
					for( $x=1; $x <= count( $pages ); $x++ ) {
						for( $y = 1; $y <= count( $pages[$x] ); $y++ ){
							if( isset( $pages[$x][$y]['id'] ) AND 
								$field_id == $pages[$x][$y]['id'] ){
								if( $error_page == '' ){
									$error_page = $x;
									break 3;
								}
							}							
						}

					}
				}
			}
		$ninja_forms_processing->update_extra_value( '_current_page', $error_page );
		}
	}
}

function ninja_forms_mp_save_page(){
	global $ninja_forms_processing, $current_user, $ninja_forms_fields;

	if( $ninja_forms_processing->get_form_setting( 'multi_part' ) ){

		$form_id = $ninja_forms_processing->get_form_ID();
		$pages = ninja_forms_mp_get_pages( $form_id );
		$page_count = count( $pages );
		$ninja_forms_processing->update_extra_value( '_page_count', $page_count );

		$sub_id = $ninja_forms_processing->get_form_setting('sub_id');
		$user_id = $ninja_forms_processing->get_user_ID();
		$form_id = $ninja_forms_processing->get_form_ID();

		$field_data = $ninja_forms_processing->get_all_fields();

		if( $sub_id != '' ){
			$sub_row = ninja_forms_get_sub_by_id( $sub_id );
			$sub_data = $sub_row['data'];
			$status = $sub_row['status'];
		}else{
			$sub_data = array();
			$status = 0;
		}

		if(is_array($field_data) AND !empty($field_data)){
			foreach($field_data as $field_id => $user_value){
				array_push( $sub_data, array( 'field_id' => $field_id, 'user_value' => $user_value ) );
			}
		}

		$sub_data = array_values( $sub_data );

		foreach( $sub_data as $row ){
			$ninja_forms_processing->update_field_value( $row['field_id'], $row['user_value'] );
			if( !$ninja_forms_processing->get_field_settings( $row['field_id'] ) ){
				$field_row = ninja_forms_get_field_by_id( $row['field_id'] );

				$ninja_forms_processing->update_field_settings( $row['field_id'], $field_row );
			}
		}

		$all_fields = ninja_forms_get_fields_by_form_id( $form_id );
		foreach( $all_fields as $field ){
			$field_id = $field['id'];
			$field_type = $field['type'];
			//if( isset( $ninja_forms_fields[$field_type] ) AND $ninja_forms_fields[$field_type]['process_field'] ){
			if( isset( $ninja_forms_fields[$field_type] ) ) {
				if( $ninja_forms_processing->get_field_value( $field_id ) === false ){
					$ninja_forms_processing->update_field_value( $field_id, false );
					$ninja_forms_processing->update_field_settings( $field_id, $field );
				}
			}
		}


		ninja_forms_mp_nav_update_current_page();
		$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );

		foreach( $pages as $page => $fields ){
			if ( function_exists( 'ninja_forms_conditionals_field_filter' ) ) {
				$show = ninja_forms_mp_check_page_conditional( $form_id, $page );
			}else{
				$show = true;
			}
	    	
	    	if( $show ){
	    		/*
	    		foreach( $fields as $field ){
					if( isset( $field['type'] ) ){
		    			$field_type = $field['type'];
		    		}else{
		    			$field_type = '';
		    		}

		    		//if( $field_type != '_page_divider' AND isset( $ninja_forms_fields[$field_type] ) AND $ninja_forms_fields[$field_type]['process_field'] ){
		    		if( $field_type != '_page_divider' AND isset( $ninja_forms_fields[$field_type] ) ) {
		    			$user_value = $ninja_forms_processing->get_field_value( $field['id'] );
		    			if( $user_value === false ){ // This page should be shown, but this field isn't present in the $ninja_forms_processing.
		    				// Update the $ninja_forms_processing to include the field with an empty string value.
		    				$ninja_forms_processing->update_field_value( $field['id'], '' );

		    				// Update the $ninja_forms_processing with the field settings for the field we just added.
		    				$field_row = ninja_forms_get_field_by_id( $field['id'] );
		    				$ninja_forms_processing->update_field_settings( $field['id'], $field_row );
		    			}
		    		}
	    		}
	    		*/
	    	}else{
	    		ninja_forms_mp_conditional_remove_page( $form_id, $page );
	    	}
	    }

		$field_data = $ninja_forms_processing->get_all_fields();

		$sub_data = array();

		if(is_array($field_data) AND !empty($field_data)){
			foreach($field_data as $field_id => $user_value){
				array_push( $sub_data, array( 'field_id' => $field_id, 'user_value' => $user_value ) );
			}
		}

		if( $ninja_forms_processing->get_action() == 'submit' ){
			ninja_forms_req_fields_process();
			unset( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] );
		}
		
		if( $ninja_forms_processing->get_action() == 'mp_save' OR $ninja_forms_processing->get_all_errors() ){
		
			if( isset( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] ) ){
				foreach( $_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] as $setting => $value ){
					if( $value != '' ){
						$ninja_forms_processing->update_form_setting( $setting, $value );
					}
				}
			}
			
			$all_form_settings = $ninja_forms_processing->get_all_form_settings();
			$_SESSION['ninja_forms_form_'.$form_id.'_form_settings'] = $all_form_settings;

			$args = array(
				'form_id' => $form_id,
				'user_id' => $user_id,
				'status' => $status,
				'action' => 'mp_save',
				'data' => serialize( $sub_data ),
			);

			if($sub_id != ''){
				$args['sub_id'] = $sub_id;
				ninja_forms_update_sub($args);
			}else{
				$sub_id = ninja_forms_insert_sub($args);
			}

			$ninja_forms_processing->update_form_setting( 'sub_id', $sub_id );

			$ninja_forms_processing->add_error( '_mp_save', '' );
		}


	}
}

/*
 * Function used to update the _current_page extra value. It looks at whether or not the prev or next buttons have been pressed.
 * If they have, it updates the current page based upon which was pressed. 
 *
 * @since 1.0.3
 * @returns void
 */

function ninja_forms_mp_nav_update_current_page(){
	global $ninja_forms_processing;

	$form_id = $ninja_forms_processing->get_form_ID();

	if( $ninja_forms_processing->get_extra_value( '_current_page' ) ){
		$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );
	}else{
		$current_page = 1;
	}	
	if( $ninja_forms_processing->get_extra_value( '_page_count' ) ){
		$page_count = $ninja_forms_processing->get_extra_value( '_page_count' );
	}else{
		$page_count = 1;
	}

	$nav = '';
	if( $ninja_forms_processing->get_extra_value( '_prev' ) ){
		$nav = 'prev';
		if( $current_page != 1 ){
			$current_page--;
		}
	}

	if( $ninja_forms_processing->get_extra_value( '_next' ) ){
		$nav = 'next';
		if( $current_page != $page_count ){
			$current_page++;
		}
	}

	if( $nav != '' ){
		$show = ninja_forms_mp_check_page_conditional( $form_id, $current_page );
		
		$ninja_forms_processing->update_extra_value( '_current_page', $current_page );

		if( ( $current_page <= $page_count ) AND !$show ){
			ninja_forms_mp_nav_update_current_page();
		}
	}		
}

/*
 *
 * Function that updates the _current_page extra value if a breadcrumb has been clicked.
 *
 * @since 1.0.3
 * @returns void
 */

function ninja_forms_mp_breadcrumb_update_current_page(){
	global $ninja_forms_processing;

	$form_id = $ninja_forms_processing->get_form_ID();
	$nav = '';
	$all_extras = $ninja_forms_processing->get_all_extras();
	if( is_array( $all_extras ) AND !empty( $all_extras ) ){
		foreach( $all_extras as $key => $val ){
			if( strpos( $key, '_mp_page_' ) !== false ){
				$nav = str_replace( '_mp_page_', '', $key );
				$ninja_forms_processing->update_extra_value( '_current_page', $nav );
				$show = ninja_forms_mp_check_page_conditional( $form_id, $nav );
				if( !$show ){
					$ninja_forms_processing->update_extra_value( '_prev', 'Previous' );
					ninja_forms_mp_nav_update_current_page();
				}

			}
		}
	}
	return $nav;
}

/*
 *
 * Function that checks whether or not this page should be shown based upon form conditionals.
 * 
 * @since 1.0.3
 * @returns bool true/false
 */

function ninja_forms_mp_check_page_conditional( $form_id = '', $current_page = '' ){
	global $ninja_forms_processing;

	if( $form_id == '' ){
		$form_id = $ninja_forms_processing->get_form_ID();
	}
	
	if( $current_page == '' ){
		$current_page = $ninja_forms_processing->get_extra_value( '_current_page' );		
	}

	// Check to see if the next page has been rendered "hidden" by conditional logic.
	$page_divider_id = ninja_forms_mp_get_divider_by_page( $form_id, $current_page );
	$data = ninja_forms_get_field_by_id( $page_divider_id );
	$data = $data['data'];
	$show = true;
	if( function_exists( 'ninja_forms_conditionals_field_filter' ) ){
		$data = ninja_forms_conditionals_field_filter( $data, $page_divider_id );
		if( isset( $data['conditional_action'] ) ){
			switch( $data['conditional_action'] ){
				case 'ninja_forms_show_mp_page':
					if( !isset( $data['conditional_pass'] ) OR !$data['conditional_pass'] ){
						$show = false;
					}
					break;
				case 'ninja_forms_hide_mp_page':
					if( isset( $data['conditional_pass'] ) AND $data['conditional_pass'] ){
						$show = false;
					}
					break;
			}
		}
	}
	return $show;
}

/*
 *
 * Function to remove the page and its fields from the $ninja_forms_processing global
 *
 * @since 1.0.3
 * @returns void
 */

function ninja_forms_mp_conditional_remove_page( $form_id, $page ){
	global $ninja_forms_processing;

	$pages = ninja_forms_mp_get_pages( $form_id );
	if( is_array( $pages[$page] ) AND !empty( $pages[$page] ) ){
		foreach( $pages[$page] as $field ){
			if( $field['type'] != '_page_divider' ){
				$ninja_forms_processing->remove_field_value( $field['id'] );
			}
		}
	}
}