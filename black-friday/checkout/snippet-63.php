<?php
/* Code Snippets #63 – as deployed 2026-11-09 (see WP admin for the live copy) */
add_action('wp_head', function () {
    if (!is_singular()) return;
    $id = (int) get_queried_object_id();
    if (!in_array($id, array(49615, 49639, 46772), true)) return;
    $code = get_post_meta($id, 'wcf-custom-script', true);
    if (is_string($code) && $code !== '') {
        echo "\n<!-- ct-bf-checkout -->\n" . $code . "\n";
    }
    if ($id === 49639) {
        echo "\n<style>.postid-49639 .woocommerce-account-fields{display:none!important}</style>\n";
    }
}, 99);

/* BF 197: every order of product 49620 gets a user (existing by email, or a new one) */
add_action('woocommerce_checkout_order_created', function ($order) {
    if (!$order || $order->get_customer_id()) return;
    $has = false;
    foreach ($order->get_items() as $item) {
        if ((int) $item->get_product_id() === 49620) { $has = true; break; }
    }
    if (!$has) return;
    $email = $order->get_billing_email();
    if (!$email || !is_email($email)) return;
    $user = get_user_by('email', $email);
    if ($user) {
        $uid = (int) $user->ID;
        $note = 'BF197: ההזמנה שויכה למשתמש קיים #' . $uid;
    } else {
        $pass = $order->get_billing_phone();
        if (!$pass) $pass = wp_generate_password(12);
        $uid = wc_create_new_customer($email, '', $pass, array(
            'first_name' => $order->get_billing_first_name(),
            'last_name'  => $order->get_billing_last_name(),
        ));
        if (is_wp_error($uid)) {
            $order->add_order_note('BF197: יצירת משתמש נכשלה: ' . $uid->get_error_message());
            $order->save();
            return;
        }
        update_user_meta($uid, 'billing_first_name', $order->get_billing_first_name());
        update_user_meta($uid, 'billing_last_name', $order->get_billing_last_name());
        update_user_meta($uid, 'billing_phone', $order->get_billing_phone());
        update_user_meta($uid, 'billing_email', $email);
        $note = 'BF197: נוצר משתמש חדש #' . $uid . ' ושויך להזמנה';
    }
    $order->set_customer_id($uid);
    $order->add_order_note($note);
    $order->save();
}, 20);
