<?php echo validation_errors(); ?>

<div class="row">
    <div class="col-12">
        <div class="page-header mb-4">
            <h1>
                <?php if(!isset($page['title'])) { ?>
                    <?php echo lang('paste_create_new'); ?>
                <?php } else { ?>
                    <?php echo $page['title']; ?>
                <?php } ?>
            </h1>
        </div>
    </div>
    <div class="col-12">
        <form action="<?php echo base_url(); ?>" method="post" class="card p-4 mb-4 paste-form-bg" enctype="multipart/form-data">
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="name" class="form-label"><?php echo lang('paste_author'); ?></label>
                    <?php 
                        $set = array(
                            'name' => 'name', 
                            'id' => 'name', 
                            'class' => 'form-control', 
                            'value' => $name_set, 
                            'maxlength' => '32', 
                            'tabindex' => '1'
                        );
                        echo form_input($set);
                    ?>
                </div>
                <div class="col-md-4">
                    <label for="title" class="form-label"><?php echo lang('paste_title'); ?></label>
                    <?php 
                        $set = array(
                            'name' => 'title', 
                            'id' => 'title', 
                            'class' => 'form-control', 
                            'value' => (isset($title_set) ? $title_set : ''), 
                            'maxlength' => '50', 
                            'tabindex' => '2'
                        );
                        echo form_input($set);
                    ?>
                </div>
                <div class="col-md-4">
                    <label for="lang" class="form-label"><?php echo lang('paste_lang'); ?></label>
                    <?php 
                        $lang_extra = 'id="lang" class="form-select" tabindex="3"'; 
                        echo form_dropdown('lang', $languages, $lang_set, $lang_extra); 
                    ?>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12">
                    <label for="code" class="form-label">
                        <?php echo lang('paste_yourpaste'); ?>
                        <span class="text-muted"> - <?php echo lang('paste_yourpaste_desc'); ?></span>
                    </label>
                </div>
            </div>
            <div class="mb-3">
                <textarea id="code" class="form-control" name="code" rows="20" tabindex="4"><?php if(isset($paste_set)) { echo $paste_set; } ?></textarea>
            </div>

            <?php if ($this->config->item('file_upload')) { ?>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="file" class="form-label"><?php echo lang('attach_file'); ?></label>
                        <input type="file" name="file" id="file" class="form-control">
                    </div>
                </div>
            <?php } ?>

            <div class="row mb-3">
                <div class="col-md-4">
                    <?php if (!$this->config->item('disable_shorturl')) { ?>
                        <div class="form-check mb-3">
                            <?php
                                $set = array(
                                    'name' => 'snipurl', 
                                    'id' => 'snipurl', 
                                    'value' => '1', 
                                    'tabindex' => '5', 
                                    'class' => 'form-check-input', 
                                    'checked' => $snipurl_set
                                );
                                if ($this->config->item('disable_shorturl')) {
                                    $set['checked'] = 0;
                                    $set['disabled'] = 'disabled';
                                }
                                echo form_checkbox($set);
                            ?>
                            <label class="form-check-label" for="snipurl">
                                <?php echo lang('paste_create_shorturl') . ' - ' . lang('paste_shorturl_desc'); ?>
                            </label>
                        </div>
                    <?php } ?>
                    <div class="form-check mb-3">
                        <?php
                            $set = array(
                                'name' => 'private', 
                                'id' => 'private', 
                                'tabindex' => '6', 
                                'value' => '1', 
                                'class' => 'form-check-input', 
                                'checked' => $private_set
                            );
                            if ($this->config->item('private_only')) {
                                $set['checked'] = 1;
                                $set['disabled'] = 'disabled';
                            }
                            echo form_checkbox($set);
                        ?>
                        <label class="form-check-label" for="private">
                            <?php echo lang('paste_private'); ?>
                            <span class="text-muted"> - <?php echo lang('paste_private_desc'); ?></span>
                        </label>
                    </div>
                    <div>
                        <label for="expire" class="form-label">
                            <?php echo lang('paste_delete'); ?>
                            <span class="text-muted"> - <?php echo lang('paste_delete_desc'); ?></span>
                        </label>
                        <?php 
                            $expire_extra = 'id="expire" class="form-select" tabindex="7"';
                            $options = array(
                                "burn"   => lang('exp_burn'),
                                "5"      => lang('exp_5min'),
                                "60"     => lang('exp_1h'),
                                "1440"   => lang('exp_1d'),
                                "10080"  => lang('exp_1w'),
                                "40320"  => lang('exp_1m'),
                                "483840" => lang('exp_1y'),
                            );
                            if (! config_item('disable_keep_forever')) {
                                $options['0'] = lang('exp_forever');
                            }
                            echo form_dropdown('expire', $options, $expire_set, $expire_extra); 
                        ?>
                    </div>
                </div>
            </div>
            <?php if($reply){ ?>
                <input type="hidden" value="<?php echo $reply; ?>" name="reply" />
            <?php } ?>
            <?php if($this->config->item('enable_captcha') && $this->session->userdata('is_human') === null) { ?>
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="captcha" class="form-label">
                            <?php echo lang('paste_spam'); ?>
                            <span class="text-muted"><?php if(!$use_recaptcha) { ?>- <?php echo lang('paste_spam_desc'); } ?></span>
                        </label>
                        <?php if($use_recaptcha){
                            echo recaptcha_get_html($recaptcha_publickey);
                        } else { ?>
                            <img class="captcha mb-2" src="<?php echo site_url('view/captcha'); ?>?<?php echo date('U', time()); ?>" alt="captcha" width="180" height="40" />
                            <input type="text" id="captcha" name="captcha" tabindex="2" maxlength="32" class="form-control">
                        <?php } ?>
                    </div>
                </div>
            <?php } ?>
            <div class="d-flex flex-column flex-md-row gap-2">
                <button type="submit" name="submit" value="submit" class="btn btn-primary btn-lg">
                    <i class="fa-regular fa-circle-up"></i>
                    <?php echo lang('paste_create'); ?>
                </button>
            </div>
            <?php
            if ($this->config->item('csrf_protection') === TRUE)
            {
                if(isset($_COOKIE[$this->config->item('csrf_cookie_name')])) {
                    echo '<input type="hidden" name="'.$this->config->item('csrf_token_name').'" value="'.html_escape($_COOKIE[$this->config->item('csrf_cookie_name')]).'" style="display:none;" />'."\n";
                }
            }
            ?>
        </form>
    </div>
</div>
