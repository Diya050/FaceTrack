Folder PATH listing for volume New Volume
Volume serial number is 28A6-A464
D:.
|   .env
|   .gitignore
|   alembic.ini
|   create_super_user.py
|   Dockerfile
|   requirements.txt
|   structure.md
|   
+---alembic
|   |   env.py
|   |   README
|   |   script.py.mako
|   |   
|   \---versions
|           37de22c53b83_add_partial_unique_index_for_platform_.py
|           4262d78b9627_refactor_system_for_multi_tenant.py
|           4c9647acf466_initial_schema.py
|           6b0e7679c46a_refactor_streams_for_multi_tenant.py
|           966bc821d9ea_refactor_attendance_for_multi_tenant.py
|           96e8d69405fc_allow_nullable_organization_id_for_.py
|           a872a3e20ed2_refactor_core_for_multi_tenant.py
|           c6e97cd30cc0_fix_users_updated_at_server_default.py
|           dd26bf7b498a_refactor_biometrics_for_multi_tenant.py
|           
+---app
|   |   config.py
|   |   main.py
|   |   __init__.py
|   |   
|   +---api
|   |   |   .gitkeep
|   |   |   deps.py
|   |   |   __init__.py
|   |   |   
|   |   +---v1
|   |   |   |   api.py
|   |   |   |   __init__.py
|   |   |   |   
|   |   |   +---endpoints
|   |   |   |   |   attendance.py
|   |   |   |   |   auth.py
|   |   |   |   |   compliance.py
|   |   |   |   |   dashboard.py
|   |   |   |   |   department.py
|   |   |   |   |   monitoring.py
|   |   |   |   |   notifications.py
|   |   |   |   |   organization.py
|   |   |   |   |   profiles.py
|   |   |   |   |   settings.py
|   |   |   |   |   support.py
|   |   |   |   |   __init__.py
|   |   |   |   |   
|   |   |   |           auth.cpython-312.pyc
|   |   |   |           department.cpython-312.pyc
|   |   |   |           organization.cpython-312.pyc
|   |   |   |           profiles.cpython-312.pyc
|   |   |   |           __init__.cpython-312.pyc
|   |   |   |           
|   |   |           api.cpython-312.pyc
|   |   |           __init__.cpython-312.pyc
|   |   |           
|   |           __init__.cpython-312.pyc
|   |           
|   +---core
|   |   |   .gitkeep
|   |   |   config.py
|   |   |   dependencies.py
|   |   |   permissions.py
|   |   |   security.py
|   |   |   __init__.py
|   |   |   
|   |           config.cpython-312.pyc
|   |           dependencies.cpython-312.pyc
|   |           permissions.cpython-312.pyc
|   |           security.cpython-312.pyc
|   |           __init__.cpython-312.pyc
|   |           
|   +---db
|   |   |   session.py
|   |   |   __init__.py
|   |   |   
|   |           session.cpython-312.pyc
|   |           __init__.cpython-312.pyc
|   |           
|   +---models
|   |   |   .gitkeep
|   |   |   attendance.py
|   |   |   biometrics.py
|   |   |   core.py
|   |   |   streams.py
|   |   |   system.py
|   |   |   __init__.py
|   |   |   
|   |           attendance.cpython-312.pyc
|   |           biometrics.cpython-312.pyc
|   |           core.cpython-312.pyc
|   |           streams.cpython-312.pyc
|   |           system.cpython-312.pyc
|   |           __init__.cpython-312.pyc
|   |           
|   +---schemas
|   |   |   .gitkeep
|   |   |   attendance.py
|   |   |   auth.py
|   |   |   dashboard.py
|   |   |   department.py
|   |   |   monitoring.py
|   |   |   organization.py
|   |   |   profile.py
|   |   |   settings.py
|   |   |   __init__.py
|   |   |   
|   |           auth.cpython-312.pyc
|   |           department.cpython-312.pyc
|   |           organization.cpython-312.pyc
|   |           profile.cpython-312.pyc
|   |           __init__.cpython-312.pyc
|   |           
|   +---services
|   |   |   .gitkeep
|   |   |   auth_service.py
|   |   |   camera_stream.py
|   |   |   department_service.py
|   |   |   face_recognition.py
|   |   |   organization_service.py
|   |   |   profile_service.py
|   |   |   report_generator.py
|   |   |   system_health.py
|   |   |   __init__.py
|   |   |   
|   |           auth_service.cpython-312.pyc
|   |           department_service.cpython-312.pyc
|   |           organization_service.cpython-312.pyc
|   |           profile_service.cpython-312.pyc
|   |           __init__.cpython-312.pyc
|   |           
|   +---utils
|   |       .gitkeep
|   |       
|   +---workers
|   |       .gitkeep
|   |       
|           main.cpython-312.pyc
|           __init__.cpython-312.pyc
|           
    |   
    +---Include
    |   \---site
    |       \---python3.12
    |           \---greenlet
    |                   greenlet.h
    |                   
    +---Lib
    |   \---site-packages
    |       |   six.py
    |       |   typing_extensions.py
    |       |   _cffi_backend.cp312-win_amd64.pyd
    |       |   
    |       +---annotated_doc
    |       |   |   main.py
    |       |   |   py.typed
    |       |   |   __init__.py
    |       |   |   
    |       |           main.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---annotated_doc-0.0.4.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---annotated_types
    |       |   |   py.typed
    |       |   |   test_cases.py
    |       |   |   __init__.py
    |       |   |   
    |       |           test_cases.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---annotated_types-0.7.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---anyio
    |       |   |   from_thread.py
    |       |   |   functools.py
    |       |   |   lowlevel.py
    |       |   |   py.typed
    |       |   |   pytest_plugin.py
    |       |   |   to_interpreter.py
    |       |   |   to_process.py
    |       |   |   to_thread.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---abc
    |       |   |   |   _eventloop.py
    |       |   |   |   _resources.py
    |       |   |   |   _sockets.py
    |       |   |   |   _streams.py
    |       |   |   |   _subprocesses.py
    |       |   |   |   _tasks.py
    |       |   |   |   _testing.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _eventloop.cpython-312.pyc
    |       |   |           _resources.cpython-312.pyc
    |       |   |           _sockets.cpython-312.pyc
    |       |   |           _streams.cpython-312.pyc
    |       |   |           _subprocesses.cpython-312.pyc
    |       |   |           _tasks.cpython-312.pyc
    |       |   |           _testing.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---streams
    |       |   |   |   buffered.py
    |       |   |   |   file.py
    |       |   |   |   memory.py
    |       |   |   |   stapled.py
    |       |   |   |   text.py
    |       |   |   |   tls.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           buffered.cpython-312.pyc
    |       |   |           file.cpython-312.pyc
    |       |   |           memory.cpython-312.pyc
    |       |   |           stapled.cpython-312.pyc
    |       |   |           text.cpython-312.pyc
    |       |   |           tls.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_backends
    |       |   |   |   _asyncio.py
    |       |   |   |   _trio.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _asyncio.cpython-312.pyc
    |       |   |           _trio.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_core
    |       |   |   |   _asyncio_selector_thread.py
    |       |   |   |   _contextmanagers.py
    |       |   |   |   _eventloop.py
    |       |   |   |   _exceptions.py
    |       |   |   |   _fileio.py
    |       |   |   |   _resources.py
    |       |   |   |   _signals.py
    |       |   |   |   _sockets.py
    |       |   |   |   _streams.py
    |       |   |   |   _subprocesses.py
    |       |   |   |   _synchronization.py
    |       |   |   |   _tasks.py
    |       |   |   |   _tempfile.py
    |       |   |   |   _testing.py
    |       |   |   |   _typedattr.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _asyncio_selector_thread.cpython-312.pyc
    |       |   |           _contextmanagers.cpython-312.pyc
    |       |   |           _eventloop.cpython-312.pyc
    |       |   |           _exceptions.cpython-312.pyc
    |       |   |           _fileio.cpython-312.pyc
    |       |   |           _resources.cpython-312.pyc
    |       |   |           _signals.cpython-312.pyc
    |       |   |           _sockets.cpython-312.pyc
    |       |   |           _streams.cpython-312.pyc
    |       |   |           _subprocesses.cpython-312.pyc
    |       |   |           _synchronization.cpython-312.pyc
    |       |   |           _tasks.cpython-312.pyc
    |       |   |           _tempfile.cpython-312.pyc
    |       |   |           _testing.cpython-312.pyc
    |       |   |           _typedattr.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           from_thread.cpython-312.pyc
    |       |           functools.cpython-312.pyc
    |       |           lowlevel.cpython-312.pyc
    |       |           pytest_plugin.cpython-312.pyc
    |       |           to_interpreter.cpython-312.pyc
    |       |           to_process.cpython-312.pyc
    |       |           to_thread.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---anyio-4.12.1.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---bcrypt
    |       |   |   py.typed
    |       |   |   _bcrypt.pyd
    |       |   |   _bcrypt.pyi
    |       |   |   __about__.py
    |       |   |   __init__.py
    |       |   |   
    |       |           __about__.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---bcrypt-4.0.1.dist-info
    |       |       INSTALLER
    |       |       LICENSE
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       top_level.txt
    |       |       WHEEL
    |       |       
    |       +---cffi
    |       |   |   api.py
    |       |   |   backend_ctypes.py
    |       |   |   cffi_opcode.py
    |       |   |   commontypes.py
    |       |   |   cparser.py
    |       |   |   error.py
    |       |   |   ffiplatform.py
    |       |   |   lock.py
    |       |   |   model.py
    |       |   |   parse_c_type.h
    |       |   |   pkgconfig.py
    |       |   |   recompiler.py
    |       |   |   setuptools_ext.py
    |       |   |   vengine_cpy.py
    |       |   |   vengine_gen.py
    |       |   |   verifier.py
    |       |   |   _cffi_errors.h
    |       |   |   _cffi_include.h
    |       |   |   _embedding.h
    |       |   |   _imp_emulation.py
    |       |   |   _shimmed_dist_utils.py
    |       |   |   __init__.py
    |       |   |   
    |       |           api.cpython-312.pyc
    |       |           backend_ctypes.cpython-312.pyc
    |       |           cffi_opcode.cpython-312.pyc
    |       |           commontypes.cpython-312.pyc
    |       |           cparser.cpython-312.pyc
    |       |           error.cpython-312.pyc
    |       |           ffiplatform.cpython-312.pyc
    |       |           lock.cpython-312.pyc
    |       |           model.cpython-312.pyc
    |       |           pkgconfig.cpython-312.pyc
    |       |           recompiler.cpython-312.pyc
    |       |           setuptools_ext.cpython-312.pyc
    |       |           vengine_cpy.cpython-312.pyc
    |       |           vengine_gen.cpython-312.pyc
    |       |           verifier.cpython-312.pyc
    |       |           _imp_emulation.cpython-312.pyc
    |       |           _shimmed_dist_utils.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---cffi-2.0.0.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           AUTHORS
    |       |           LICENSE
    |       |           
    |       +---click
    |       |   |   core.py
    |       |   |   decorators.py
    |       |   |   exceptions.py
    |       |   |   formatting.py
    |       |   |   globals.py
    |       |   |   parser.py
    |       |   |   py.typed
    |       |   |   shell_completion.py
    |       |   |   termui.py
    |       |   |   testing.py
    |       |   |   types.py
    |       |   |   utils.py
    |       |   |   _compat.py
    |       |   |   _termui_impl.py
    |       |   |   _textwrap.py
    |       |   |   _utils.py
    |       |   |   _winconsole.py
    |       |   |   __init__.py
    |       |   |   
    |       |           core.cpython-312.pyc
    |       |           decorators.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           formatting.cpython-312.pyc
    |       |           globals.cpython-312.pyc
    |       |           parser.cpython-312.pyc
    |       |           shell_completion.cpython-312.pyc
    |       |           termui.cpython-312.pyc
    |       |           testing.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           utils.cpython-312.pyc
    |       |           _compat.cpython-312.pyc
    |       |           _termui_impl.cpython-312.pyc
    |       |           _textwrap.cpython-312.pyc
    |       |           _utils.cpython-312.pyc
    |       |           _winconsole.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---click-8.3.1.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.txt
    |       |           
    |       +---colorama
    |       |   |   ansi.py
    |       |   |   ansitowin32.py
    |       |   |   initialise.py
    |       |   |   win32.py
    |       |   |   winterm.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---tests
    |       |   |   |   ansitowin32_test.py
    |       |   |   |   ansi_test.py
    |       |   |   |   initialise_test.py
    |       |   |   |   isatty_test.py
    |       |   |   |   utils.py
    |       |   |   |   winterm_test.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           ansitowin32_test.cpython-312.pyc
    |       |   |           ansi_test.cpython-312.pyc
    |       |   |           initialise_test.cpython-312.pyc
    |       |   |           isatty_test.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           winterm_test.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           ansi.cpython-312.pyc
    |       |           ansitowin32.cpython-312.pyc
    |       |           initialise.cpython-312.pyc
    |       |           win32.cpython-312.pyc
    |       |           winterm.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---colorama-0.4.6.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.txt
    |       |           
    |       +---cryptography
    |       |   |   exceptions.py
    |       |   |   fernet.py
    |       |   |   py.typed
    |       |   |   utils.py
    |       |   |   __about__.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---hazmat
    |       |   |   |   _oid.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---asn1
    |       |   |   |   |   asn1.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           asn1.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---backends
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---openssl
    |       |   |   |   |   |   backend.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           backend.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---bindings
    |       |   |   |   |   _rust.pyd
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---openssl
    |       |   |   |   |   |   binding.py
    |       |   |   |   |   |   _conditional.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           binding.cpython-312.pyc
    |       |   |   |   |           _conditional.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---_rust
    |       |   |   |   |   |   asn1.pyi
    |       |   |   |   |   |   declarative_asn1.pyi
    |       |   |   |   |   |   exceptions.pyi
    |       |   |   |   |   |   ocsp.pyi
    |       |   |   |   |   |   pkcs12.pyi
    |       |   |   |   |   |   pkcs7.pyi
    |       |   |   |   |   |   test_support.pyi
    |       |   |   |   |   |   x509.pyi
    |       |   |   |   |   |   _openssl.pyi
    |       |   |   |   |   |   __init__.pyi
    |       |   |   |   |   |   
    |       |   |   |   |   \---openssl
    |       |   |   |   |           aead.pyi
    |       |   |   |   |           ciphers.pyi
    |       |   |   |   |           cmac.pyi
    |       |   |   |   |           dh.pyi
    |       |   |   |   |           dsa.pyi
    |       |   |   |   |           ec.pyi
    |       |   |   |   |           ed25519.pyi
    |       |   |   |   |           ed448.pyi
    |       |   |   |   |           hashes.pyi
    |       |   |   |   |           hmac.pyi
    |       |   |   |   |           kdf.pyi
    |       |   |   |   |           keys.pyi
    |       |   |   |   |           poly1305.pyi
    |       |   |   |   |           rsa.pyi
    |       |   |   |   |           x25519.pyi
    |       |   |   |   |           x448.pyi
    |       |   |   |   |           __init__.pyi
    |       |   |   |   |           
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---decrepit
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---ciphers
    |       |   |   |   |   |   algorithms.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           algorithms.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---primitives
    |       |   |   |   |   cmac.py
    |       |   |   |   |   constant_time.py
    |       |   |   |   |   hashes.py
    |       |   |   |   |   hmac.py
    |       |   |   |   |   keywrap.py
    |       |   |   |   |   padding.py
    |       |   |   |   |   poly1305.py
    |       |   |   |   |   _asymmetric.py
    |       |   |   |   |   _cipheralgorithm.py
    |       |   |   |   |   _serialization.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---asymmetric
    |       |   |   |   |   |   dh.py
    |       |   |   |   |   |   dsa.py
    |       |   |   |   |   |   ec.py
    |       |   |   |   |   |   ed25519.py
    |       |   |   |   |   |   ed448.py
    |       |   |   |   |   |   padding.py
    |       |   |   |   |   |   rsa.py
    |       |   |   |   |   |   types.py
    |       |   |   |   |   |   utils.py
    |       |   |   |   |   |   x25519.py
    |       |   |   |   |   |   x448.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           dh.cpython-312.pyc
    |       |   |   |   |           dsa.cpython-312.pyc
    |       |   |   |   |           ec.cpython-312.pyc
    |       |   |   |   |           ed25519.cpython-312.pyc
    |       |   |   |   |           ed448.cpython-312.pyc
    |       |   |   |   |           padding.cpython-312.pyc
    |       |   |   |   |           rsa.cpython-312.pyc
    |       |   |   |   |           types.cpython-312.pyc
    |       |   |   |   |           utils.cpython-312.pyc
    |       |   |   |   |           x25519.cpython-312.pyc
    |       |   |   |   |           x448.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---ciphers
    |       |   |   |   |   |   aead.py
    |       |   |   |   |   |   algorithms.py
    |       |   |   |   |   |   base.py
    |       |   |   |   |   |   modes.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           aead.cpython-312.pyc
    |       |   |   |   |           algorithms.cpython-312.pyc
    |       |   |   |   |           base.cpython-312.pyc
    |       |   |   |   |           modes.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---kdf
    |       |   |   |   |   |   argon2.py
    |       |   |   |   |   |   concatkdf.py
    |       |   |   |   |   |   hkdf.py
    |       |   |   |   |   |   kbkdf.py
    |       |   |   |   |   |   pbkdf2.py
    |       |   |   |   |   |   scrypt.py
    |       |   |   |   |   |   x963kdf.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           argon2.cpython-312.pyc
    |       |   |   |   |           concatkdf.cpython-312.pyc
    |       |   |   |   |           hkdf.cpython-312.pyc
    |       |   |   |   |           kbkdf.cpython-312.pyc
    |       |   |   |   |           pbkdf2.cpython-312.pyc
    |       |   |   |   |           scrypt.cpython-312.pyc
    |       |   |   |   |           x963kdf.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---serialization
    |       |   |   |   |   |   base.py
    |       |   |   |   |   |   pkcs12.py
    |       |   |   |   |   |   pkcs7.py
    |       |   |   |   |   |   ssh.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           base.cpython-312.pyc
    |       |   |   |   |           pkcs12.cpython-312.pyc
    |       |   |   |   |           pkcs7.cpython-312.pyc
    |       |   |   |   |           ssh.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---twofactor
    |       |   |   |   |   |   hotp.py
    |       |   |   |   |   |   totp.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           hotp.cpython-312.pyc
    |       |   |   |   |           totp.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           cmac.cpython-312.pyc
    |       |   |   |           constant_time.cpython-312.pyc
    |       |   |   |           hashes.cpython-312.pyc
    |       |   |   |           hmac.cpython-312.pyc
    |       |   |   |           keywrap.cpython-312.pyc
    |       |   |   |           padding.cpython-312.pyc
    |       |   |   |           poly1305.cpython-312.pyc
    |       |   |   |           _asymmetric.cpython-312.pyc
    |       |   |   |           _cipheralgorithm.cpython-312.pyc
    |       |   |   |           _serialization.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           _oid.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---x509
    |       |   |   |   base.py
    |       |   |   |   certificate_transparency.py
    |       |   |   |   extensions.py
    |       |   |   |   general_name.py
    |       |   |   |   name.py
    |       |   |   |   ocsp.py
    |       |   |   |   oid.py
    |       |   |   |   verification.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           certificate_transparency.cpython-312.pyc
    |       |   |           extensions.cpython-312.pyc
    |       |   |           general_name.cpython-312.pyc
    |       |   |           name.cpython-312.pyc
    |       |   |           ocsp.cpython-312.pyc
    |       |   |           oid.cpython-312.pyc
    |       |   |           verification.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           exceptions.cpython-312.pyc
    |       |           fernet.cpython-312.pyc
    |       |           utils.cpython-312.pyc
    |       |           __about__.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---cryptography-46.0.5.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           LICENSE.APACHE
    |       |           LICENSE.BSD
    |       |           
    |       +---dns
    |       |   |   asyncbackend.py
    |       |   |   asyncquery.py
    |       |   |   asyncresolver.py
    |       |   |   btree.py
    |       |   |   btreezone.py
    |       |   |   dnssec.py
    |       |   |   dnssectypes.py
    |       |   |   e164.py
    |       |   |   edns.py
    |       |   |   entropy.py
    |       |   |   enum.py
    |       |   |   exception.py
    |       |   |   flags.py
    |       |   |   grange.py
    |       |   |   immutable.py
    |       |   |   inet.py
    |       |   |   ipv4.py
    |       |   |   ipv6.py
    |       |   |   message.py
    |       |   |   name.py
    |       |   |   namedict.py
    |       |   |   nameserver.py
    |       |   |   node.py
    |       |   |   opcode.py
    |       |   |   py.typed
    |       |   |   query.py
    |       |   |   rcode.py
    |       |   |   rdata.py
    |       |   |   rdataclass.py
    |       |   |   rdataset.py
    |       |   |   rdatatype.py
    |       |   |   renderer.py
    |       |   |   resolver.py
    |       |   |   reversename.py
    |       |   |   rrset.py
    |       |   |   serial.py
    |       |   |   set.py
    |       |   |   tokenizer.py
    |       |   |   transaction.py
    |       |   |   tsig.py
    |       |   |   tsigkeyring.py
    |       |   |   ttl.py
    |       |   |   update.py
    |       |   |   version.py
    |       |   |   versioned.py
    |       |   |   win32util.py
    |       |   |   wire.py
    |       |   |   xfr.py
    |       |   |   zone.py
    |       |   |   zonefile.py
    |       |   |   zonetypes.py
    |       |   |   _asyncbackend.py
    |       |   |   _asyncio_backend.py
    |       |   |   _ddr.py
    |       |   |   _features.py
    |       |   |   _immutable_ctx.py
    |       |   |   _no_ssl.py
    |       |   |   _tls_util.py
    |       |   |   _trio_backend.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---dnssecalgs
    |       |   |   |   base.py
    |       |   |   |   cryptography.py
    |       |   |   |   dsa.py
    |       |   |   |   ecdsa.py
    |       |   |   |   eddsa.py
    |       |   |   |   rsa.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           cryptography.cpython-312.pyc
    |       |   |           dsa.cpython-312.pyc
    |       |   |           ecdsa.cpython-312.pyc
    |       |   |           eddsa.cpython-312.pyc
    |       |   |           rsa.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---quic
    |       |   |   |   _asyncio.py
    |       |   |   |   _common.py
    |       |   |   |   _sync.py
    |       |   |   |   _trio.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _asyncio.cpython-312.pyc
    |       |   |           _common.cpython-312.pyc
    |       |   |           _sync.cpython-312.pyc
    |       |   |           _trio.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---rdtypes
    |       |   |   |   dnskeybase.py
    |       |   |   |   dsbase.py
    |       |   |   |   euibase.py
    |       |   |   |   mxbase.py
    |       |   |   |   nsbase.py
    |       |   |   |   svcbbase.py
    |       |   |   |   tlsabase.py
    |       |   |   |   txtbase.py
    |       |   |   |   util.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---ANY
    |       |   |   |   |   AFSDB.py
    |       |   |   |   |   AMTRELAY.py
    |       |   |   |   |   AVC.py
    |       |   |   |   |   CAA.py
    |       |   |   |   |   CDNSKEY.py
    |       |   |   |   |   CDS.py
    |       |   |   |   |   CERT.py
    |       |   |   |   |   CNAME.py
    |       |   |   |   |   CSYNC.py
    |       |   |   |   |   DLV.py
    |       |   |   |   |   DNAME.py
    |       |   |   |   |   DNSKEY.py
    |       |   |   |   |   DS.py
    |       |   |   |   |   DSYNC.py
    |       |   |   |   |   EUI48.py
    |       |   |   |   |   EUI64.py
    |       |   |   |   |   GPOS.py
    |       |   |   |   |   HINFO.py
    |       |   |   |   |   HIP.py
    |       |   |   |   |   ISDN.py
    |       |   |   |   |   L32.py
    |       |   |   |   |   L64.py
    |       |   |   |   |   LOC.py
    |       |   |   |   |   LP.py
    |       |   |   |   |   MX.py
    |       |   |   |   |   NID.py
    |       |   |   |   |   NINFO.py
    |       |   |   |   |   NS.py
    |       |   |   |   |   NSEC.py
    |       |   |   |   |   NSEC3.py
    |       |   |   |   |   NSEC3PARAM.py
    |       |   |   |   |   OPENPGPKEY.py
    |       |   |   |   |   OPT.py
    |       |   |   |   |   PTR.py
    |       |   |   |   |   RESINFO.py
    |       |   |   |   |   RP.py
    |       |   |   |   |   RRSIG.py
    |       |   |   |   |   RT.py
    |       |   |   |   |   SMIMEA.py
    |       |   |   |   |   SOA.py
    |       |   |   |   |   SPF.py
    |       |   |   |   |   SSHFP.py
    |       |   |   |   |   TKEY.py
    |       |   |   |   |   TLSA.py
    |       |   |   |   |   TSIG.py
    |       |   |   |   |   TXT.py
    |       |   |   |   |   URI.py
    |       |   |   |   |   WALLET.py
    |       |   |   |   |   X25.py
    |       |   |   |   |   ZONEMD.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           AFSDB.cpython-312.pyc
    |       |   |   |           AMTRELAY.cpython-312.pyc
    |       |   |   |           AVC.cpython-312.pyc
    |       |   |   |           CAA.cpython-312.pyc
    |       |   |   |           CDNSKEY.cpython-312.pyc
    |       |   |   |           CDS.cpython-312.pyc
    |       |   |   |           CERT.cpython-312.pyc
    |       |   |   |           CNAME.cpython-312.pyc
    |       |   |   |           CSYNC.cpython-312.pyc
    |       |   |   |           DLV.cpython-312.pyc
    |       |   |   |           DNAME.cpython-312.pyc
    |       |   |   |           DNSKEY.cpython-312.pyc
    |       |   |   |           DS.cpython-312.pyc
    |       |   |   |           DSYNC.cpython-312.pyc
    |       |   |   |           EUI48.cpython-312.pyc
    |       |   |   |           EUI64.cpython-312.pyc
    |       |   |   |           GPOS.cpython-312.pyc
    |       |   |   |           HINFO.cpython-312.pyc
    |       |   |   |           HIP.cpython-312.pyc
    |       |   |   |           ISDN.cpython-312.pyc
    |       |   |   |           L32.cpython-312.pyc
    |       |   |   |           L64.cpython-312.pyc
    |       |   |   |           LOC.cpython-312.pyc
    |       |   |   |           LP.cpython-312.pyc
    |       |   |   |           MX.cpython-312.pyc
    |       |   |   |           NID.cpython-312.pyc
    |       |   |   |           NINFO.cpython-312.pyc
    |       |   |   |           NS.cpython-312.pyc
    |       |   |   |           NSEC.cpython-312.pyc
    |       |   |   |           NSEC3.cpython-312.pyc
    |       |   |   |           NSEC3PARAM.cpython-312.pyc
    |       |   |   |           OPENPGPKEY.cpython-312.pyc
    |       |   |   |           OPT.cpython-312.pyc
    |       |   |   |           PTR.cpython-312.pyc
    |       |   |   |           RESINFO.cpython-312.pyc
    |       |   |   |           RP.cpython-312.pyc
    |       |   |   |           RRSIG.cpython-312.pyc
    |       |   |   |           RT.cpython-312.pyc
    |       |   |   |           SMIMEA.cpython-312.pyc
    |       |   |   |           SOA.cpython-312.pyc
    |       |   |   |           SPF.cpython-312.pyc
    |       |   |   |           SSHFP.cpython-312.pyc
    |       |   |   |           TKEY.cpython-312.pyc
    |       |   |   |           TLSA.cpython-312.pyc
    |       |   |   |           TSIG.cpython-312.pyc
    |       |   |   |           TXT.cpython-312.pyc
    |       |   |   |           URI.cpython-312.pyc
    |       |   |   |           WALLET.cpython-312.pyc
    |       |   |   |           X25.cpython-312.pyc
    |       |   |   |           ZONEMD.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---CH
    |       |   |   |   |   A.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           A.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---IN
    |       |   |   |   |   A.py
    |       |   |   |   |   AAAA.py
    |       |   |   |   |   APL.py
    |       |   |   |   |   DHCID.py
    |       |   |   |   |   HTTPS.py
    |       |   |   |   |   IPSECKEY.py
    |       |   |   |   |   KX.py
    |       |   |   |   |   NAPTR.py
    |       |   |   |   |   NSAP.py
    |       |   |   |   |   NSAP_PTR.py
    |       |   |   |   |   PX.py
    |       |   |   |   |   SRV.py
    |       |   |   |   |   SVCB.py
    |       |   |   |   |   WKS.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           A.cpython-312.pyc
    |       |   |   |           AAAA.cpython-312.pyc
    |       |   |   |           APL.cpython-312.pyc
    |       |   |   |           DHCID.cpython-312.pyc
    |       |   |   |           HTTPS.cpython-312.pyc
    |       |   |   |           IPSECKEY.cpython-312.pyc
    |       |   |   |           KX.cpython-312.pyc
    |       |   |   |           NAPTR.cpython-312.pyc
    |       |   |   |           NSAP.cpython-312.pyc
    |       |   |   |           NSAP_PTR.cpython-312.pyc
    |       |   |   |           PX.cpython-312.pyc
    |       |   |   |           SRV.cpython-312.pyc
    |       |   |   |           SVCB.cpython-312.pyc
    |       |   |   |           WKS.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           dnskeybase.cpython-312.pyc
    |       |   |           dsbase.cpython-312.pyc
    |       |   |           euibase.cpython-312.pyc
    |       |   |           mxbase.cpython-312.pyc
    |       |   |           nsbase.cpython-312.pyc
    |       |   |           svcbbase.cpython-312.pyc
    |       |   |           tlsabase.cpython-312.pyc
    |       |   |           txtbase.cpython-312.pyc
    |       |   |           util.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           asyncbackend.cpython-312.pyc
    |       |           asyncquery.cpython-312.pyc
    |       |           asyncresolver.cpython-312.pyc
    |       |           btree.cpython-312.pyc
    |       |           btreezone.cpython-312.pyc
    |       |           dnssec.cpython-312.pyc
    |       |           dnssectypes.cpython-312.pyc
    |       |           e164.cpython-312.pyc
    |       |           edns.cpython-312.pyc
    |       |           entropy.cpython-312.pyc
    |       |           enum.cpython-312.pyc
    |       |           exception.cpython-312.pyc
    |       |           flags.cpython-312.pyc
    |       |           grange.cpython-312.pyc
    |       |           immutable.cpython-312.pyc
    |       |           inet.cpython-312.pyc
    |       |           ipv4.cpython-312.pyc
    |       |           ipv6.cpython-312.pyc
    |       |           message.cpython-312.pyc
    |       |           name.cpython-312.pyc
    |       |           namedict.cpython-312.pyc
    |       |           nameserver.cpython-312.pyc
    |       |           node.cpython-312.pyc
    |       |           opcode.cpython-312.pyc
    |       |           query.cpython-312.pyc
    |       |           rcode.cpython-312.pyc
    |       |           rdata.cpython-312.pyc
    |       |           rdataclass.cpython-312.pyc
    |       |           rdataset.cpython-312.pyc
    |       |           rdatatype.cpython-312.pyc
    |       |           renderer.cpython-312.pyc
    |       |           resolver.cpython-312.pyc
    |       |           reversename.cpython-312.pyc
    |       |           rrset.cpython-312.pyc
    |       |           serial.cpython-312.pyc
    |       |           set.cpython-312.pyc
    |       |           tokenizer.cpython-312.pyc
    |       |           transaction.cpython-312.pyc
    |       |           tsig.cpython-312.pyc
    |       |           tsigkeyring.cpython-312.pyc
    |       |           ttl.cpython-312.pyc
    |       |           update.cpython-312.pyc
    |       |           version.cpython-312.pyc
    |       |           versioned.cpython-312.pyc
    |       |           win32util.cpython-312.pyc
    |       |           wire.cpython-312.pyc
    |       |           xfr.cpython-312.pyc
    |       |           zone.cpython-312.pyc
    |       |           zonefile.cpython-312.pyc
    |       |           zonetypes.cpython-312.pyc
    |       |           _asyncbackend.cpython-312.pyc
    |       |           _asyncio_backend.cpython-312.pyc
    |       |           _ddr.cpython-312.pyc
    |       |           _features.cpython-312.pyc
    |       |           _immutable_ctx.cpython-312.pyc
    |       |           _no_ssl.cpython-312.pyc
    |       |           _tls_util.cpython-312.pyc
    |       |           _trio_backend.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---dnspython-2.8.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---dotenv
    |       |   |   cli.py
    |       |   |   ipython.py
    |       |   |   main.py
    |       |   |   parser.py
    |       |   |   py.typed
    |       |   |   variables.py
    |       |   |   version.py
    |       |   |   __init__.py
    |       |   |   __main__.py
    |       |   |   
    |       |           cli.cpython-312.pyc
    |       |           ipython.cpython-312.pyc
    |       |           main.cpython-312.pyc
    |       |           parser.cpython-312.pyc
    |       |           variables.cpython-312.pyc
    |       |           version.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           __main__.cpython-312.pyc
    |       |           
    |       +---ecdsa
    |       |   |   curves.py
    |       |   |   der.py
    |       |   |   ecdh.py
    |       |   |   ecdsa.py
    |       |   |   eddsa.py
    |       |   |   ellipticcurve.py
    |       |   |   errors.py
    |       |   |   keys.py
    |       |   |   numbertheory.py
    |       |   |   rfc6979.py
    |       |   |   ssh.py
    |       |   |   test_curves.py
    |       |   |   test_der.py
    |       |   |   test_ecdh.py
    |       |   |   test_ecdsa.py
    |       |   |   test_eddsa.py
    |       |   |   test_ellipticcurve.py
    |       |   |   test_jacobi.py
    |       |   |   test_keys.py
    |       |   |   test_malformed_sigs.py
    |       |   |   test_numbertheory.py
    |       |   |   test_pyecdsa.py
    |       |   |   test_rw_lock.py
    |       |   |   test_sha3.py
    |       |   |   util.py
    |       |   |   _compat.py
    |       |   |   _rwlock.py
    |       |   |   _sha3.py
    |       |   |   _version.py
    |       |   |   __init__.py
    |       |   |   
    |       |           curves.cpython-312.pyc
    |       |           der.cpython-312.pyc
    |       |           ecdh.cpython-312.pyc
    |       |           ecdsa.cpython-312.pyc
    |       |           eddsa.cpython-312.pyc
    |       |           ellipticcurve.cpython-312.pyc
    |       |           errors.cpython-312.pyc
    |       |           keys.cpython-312.pyc
    |       |           numbertheory.cpython-312.pyc
    |       |           rfc6979.cpython-312.pyc
    |       |           ssh.cpython-312.pyc
    |       |           test_curves.cpython-312.pyc
    |       |           test_der.cpython-312.pyc
    |       |           test_ecdh.cpython-312.pyc
    |       |           test_ecdsa.cpython-312.pyc
    |       |           test_eddsa.cpython-312.pyc
    |       |           test_ellipticcurve.cpython-312.pyc
    |       |           test_jacobi.cpython-312.pyc
    |       |           test_keys.cpython-312.pyc
    |       |           test_malformed_sigs.cpython-312.pyc
    |       |           test_numbertheory.cpython-312.pyc
    |       |           test_pyecdsa.cpython-312.pyc
    |       |           test_rw_lock.cpython-312.pyc
    |       |           test_sha3.cpython-312.pyc
    |       |           util.cpython-312.pyc
    |       |           _compat.cpython-312.pyc
    |       |           _rwlock.cpython-312.pyc
    |       |           _sha3.cpython-312.pyc
    |       |           _version.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---ecdsa-0.19.1.dist-info
    |       |       INSTALLER
    |       |       LICENSE
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       top_level.txt
    |       |       WHEEL
    |       |       
    |       +---email_validator
    |       |   |   deliverability.py
    |       |   |   exceptions.py
    |       |   |   py.typed
    |       |   |   rfc_constants.py
    |       |   |   syntax.py
    |       |   |   types.py
    |       |   |   validate_email.py
    |       |   |   version.py
    |       |   |   __init__.py
    |       |   |   __main__.py
    |       |   |   
    |       |           deliverability.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           rfc_constants.cpython-312.pyc
    |       |           syntax.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           validate_email.cpython-312.pyc
    |       |           version.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           __main__.cpython-312.pyc
    |       |           
    |       +---email_validator-2.3.0.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---fastapi
    |       |   |   applications.py
    |       |   |   background.py
    |       |   |   cli.py
    |       |   |   concurrency.py
    |       |   |   datastructures.py
    |       |   |   encoders.py
    |       |   |   exceptions.py
    |       |   |   exception_handlers.py
    |       |   |   logger.py
    |       |   |   params.py
    |       |   |   param_functions.py
    |       |   |   py.typed
    |       |   |   requests.py
    |       |   |   responses.py
    |       |   |   routing.py
    |       |   |   staticfiles.py
    |       |   |   templating.py
    |       |   |   testclient.py
    |       |   |   types.py
    |       |   |   utils.py
    |       |   |   websockets.py
    |       |   |   __init__.py
    |       |   |   __main__.py
    |       |   |   
    |       |   +---dependencies
    |       |   |   |   models.py
    |       |   |   |   utils.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           models.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---middleware
    |       |   |   |   asyncexitstack.py
    |       |   |   |   cors.py
    |       |   |   |   gzip.py
    |       |   |   |   httpsredirect.py
    |       |   |   |   trustedhost.py
    |       |   |   |   wsgi.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           asyncexitstack.cpython-312.pyc
    |       |   |           cors.cpython-312.pyc
    |       |   |           gzip.cpython-312.pyc
    |       |   |           httpsredirect.cpython-312.pyc
    |       |   |           trustedhost.cpython-312.pyc
    |       |   |           wsgi.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---openapi
    |       |   |   |   constants.py
    |       |   |   |   docs.py
    |       |   |   |   models.py
    |       |   |   |   utils.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           constants.cpython-312.pyc
    |       |   |           docs.cpython-312.pyc
    |       |   |           models.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---security
    |       |   |   |   api_key.py
    |       |   |   |   base.py
    |       |   |   |   http.py
    |       |   |   |   oauth2.py
    |       |   |   |   open_id_connect_url.py
    |       |   |   |   utils.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           api_key.cpython-312.pyc
    |       |   |           base.cpython-312.pyc
    |       |   |           http.cpython-312.pyc
    |       |   |           oauth2.cpython-312.pyc
    |       |   |           open_id_connect_url.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_compat
    |       |   |   |   shared.py
    |       |   |   |   v2.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           shared.cpython-312.pyc
    |       |   |           v2.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           applications.cpython-312.pyc
    |       |           background.cpython-312.pyc
    |       |           cli.cpython-312.pyc
    |       |           concurrency.cpython-312.pyc
    |       |           datastructures.cpython-312.pyc
    |       |           encoders.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           exception_handlers.cpython-312.pyc
    |       |           logger.cpython-312.pyc
    |       |           params.cpython-312.pyc
    |       |           param_functions.cpython-312.pyc
    |       |           requests.cpython-312.pyc
    |       |           responses.cpython-312.pyc
    |       |           routing.cpython-312.pyc
    |       |           staticfiles.cpython-312.pyc
    |       |           templating.cpython-312.pyc
    |       |           testclient.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           utils.cpython-312.pyc
    |       |           websockets.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           __main__.cpython-312.pyc
    |       |           
    |       +---fastapi-0.129.0.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---greenlet
    |       |   |   CObjects.cpp
    |       |   |   greenlet.cpp
    |       |   |   greenlet.h
    |       |   |   greenlet_allocator.hpp
    |       |   |   greenlet_compiler_compat.hpp
    |       |   |   greenlet_cpython_compat.hpp
    |       |   |   greenlet_exceptions.hpp
    |       |   |   greenlet_internal.hpp
    |       |   |   greenlet_msvc_compat.hpp
    |       |   |   greenlet_refs.hpp
    |       |   |   greenlet_slp_switch.hpp
    |       |   |   greenlet_thread_support.hpp
    |       |   |   PyGreenlet.cpp
    |       |   |   PyGreenlet.hpp
    |       |   |   PyGreenletUnswitchable.cpp
    |       |   |   PyModule.cpp
    |       |   |   slp_platformselect.h
    |       |   |   TBrokenGreenlet.cpp
    |       |   |   TExceptionState.cpp
    |       |   |   TGreenlet.cpp
    |       |   |   TGreenlet.hpp
    |       |   |   TGreenletGlobals.cpp
    |       |   |   TMainGreenlet.cpp
    |       |   |   TPythonState.cpp
    |       |   |   TStackState.cpp
    |       |   |   TThreadState.hpp
    |       |   |   TThreadStateCreator.hpp
    |       |   |   TThreadStateDestroy.cpp
    |       |   |   TUserGreenlet.cpp
    |       |   |   _greenlet.cp312-win_amd64.pyd
    |       |   |   __init__.py
    |       |   |   
    |       |   +---platform
    |       |   |   |   setup_switch_x64_masm.cmd
    |       |   |   |   switch_aarch64_gcc.h
    |       |   |   |   switch_alpha_unix.h
    |       |   |   |   switch_amd64_unix.h
    |       |   |   |   switch_arm32_gcc.h
    |       |   |   |   switch_arm32_ios.h
    |       |   |   |   switch_arm64_masm.asm
    |       |   |   |   switch_arm64_masm.obj
    |       |   |   |   switch_arm64_msvc.h
    |       |   |   |   switch_csky_gcc.h
    |       |   |   |   switch_loongarch64_linux.h
    |       |   |   |   switch_m68k_gcc.h
    |       |   |   |   switch_mips_unix.h
    |       |   |   |   switch_ppc64_aix.h
    |       |   |   |   switch_ppc64_linux.h
    |       |   |   |   switch_ppc_aix.h
    |       |   |   |   switch_ppc_linux.h
    |       |   |   |   switch_ppc_macosx.h
    |       |   |   |   switch_ppc_unix.h
    |       |   |   |   switch_riscv_unix.h
    |       |   |   |   switch_s390_unix.h
    |       |   |   |   switch_sh_gcc.h
    |       |   |   |   switch_sparc_sun_gcc.h
    |       |   |   |   switch_x32_unix.h
    |       |   |   |   switch_x64_masm.asm
    |       |   |   |   switch_x64_masm.obj
    |       |   |   |   switch_x64_msvc.h
    |       |   |   |   switch_x86_msvc.h
    |       |   |   |   switch_x86_unix.h
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---tests
    |       |   |   |   fail_clearing_run_switches.py
    |       |   |   |   fail_cpp_exception.py
    |       |   |   |   fail_initialstub_already_started.py
    |       |   |   |   fail_slp_switch.py
    |       |   |   |   fail_switch_three_greenlets.py
    |       |   |   |   fail_switch_three_greenlets2.py
    |       |   |   |   fail_switch_two_greenlets.py
    |       |   |   |   leakcheck.py
    |       |   |   |   test_contextvars.py
    |       |   |   |   test_cpp.py
    |       |   |   |   test_extension_interface.py
    |       |   |   |   test_gc.py
    |       |   |   |   test_generator.py
    |       |   |   |   test_generator_nested.py
    |       |   |   |   test_greenlet.py
    |       |   |   |   test_greenlet_trash.py
    |       |   |   |   test_interpreter_shutdown.py
    |       |   |   |   test_leaks.py
    |       |   |   |   test_stack_saved.py
    |       |   |   |   test_throw.py
    |       |   |   |   test_tracing.py
    |       |   |   |   test_version.py
    |       |   |   |   test_weakref.py
    |       |   |   |   _test_extension.c
    |       |   |   |   _test_extension.cp312-win_amd64.pyd
    |       |   |   |   _test_extension_cpp.cp312-win_amd64.pyd
    |       |   |   |   _test_extension_cpp.cpp
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           fail_clearing_run_switches.cpython-312.pyc
    |       |   |           fail_cpp_exception.cpython-312.pyc
    |       |   |           fail_initialstub_already_started.cpython-312.pyc
    |       |   |           fail_slp_switch.cpython-312.pyc
    |       |   |           fail_switch_three_greenlets.cpython-312.pyc
    |       |   |           fail_switch_three_greenlets2.cpython-312.pyc
    |       |   |           fail_switch_two_greenlets.cpython-312.pyc
    |       |   |           leakcheck.cpython-312.pyc
    |       |   |           test_contextvars.cpython-312.pyc
    |       |   |           test_cpp.cpython-312.pyc
    |       |   |           test_extension_interface.cpython-312.pyc
    |       |   |           test_gc.cpython-312.pyc
    |       |   |           test_generator.cpython-312.pyc
    |       |   |           test_generator_nested.cpython-312.pyc
    |       |   |           test_greenlet.cpython-312.pyc
    |       |   |           test_greenlet_trash.cpython-312.pyc
    |       |   |           test_interpreter_shutdown.cpython-312.pyc
    |       |   |           test_leaks.cpython-312.pyc
    |       |   |           test_stack_saved.cpython-312.pyc
    |       |   |           test_throw.cpython-312.pyc
    |       |   |           test_tracing.cpython-312.pyc
    |       |   |           test_version.cpython-312.pyc
    |       |   |           test_weakref.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---greenlet-3.3.2.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           LICENSE.PSF
    |       |           
    |       +---h11
    |       |   |   py.typed
    |       |   |   _abnf.py
    |       |   |   _connection.py
    |       |   |   _events.py
    |       |   |   _headers.py
    |       |   |   _readers.py
    |       |   |   _receivebuffer.py
    |       |   |   _state.py
    |       |   |   _util.py
    |       |   |   _version.py
    |       |   |   _writers.py
    |       |   |   __init__.py
    |       |   |   
    |       |           _abnf.cpython-312.pyc
    |       |           _connection.cpython-312.pyc
    |       |           _events.cpython-312.pyc
    |       |           _headers.cpython-312.pyc
    |       |           _readers.cpython-312.pyc
    |       |           _receivebuffer.cpython-312.pyc
    |       |           _state.cpython-312.pyc
    |       |           _util.cpython-312.pyc
    |       |           _version.cpython-312.pyc
    |       |           _writers.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---h11-0.16.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.txt
    |       |           
    |       +---idna
    |       |   |   codec.py
    |       |   |   compat.py
    |       |   |   core.py
    |       |   |   idnadata.py
    |       |   |   intranges.py
    |       |   |   package_data.py
    |       |   |   py.typed
    |       |   |   uts46data.py
    |       |   |   __init__.py
    |       |   |   
    |       |           codec.cpython-312.pyc
    |       |           compat.cpython-312.pyc
    |       |           core.cpython-312.pyc
    |       |           idnadata.cpython-312.pyc
    |       |           intranges.cpython-312.pyc
    |       |           package_data.cpython-312.pyc
    |       |           uts46data.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---idna-3.11.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.md
    |       |           
    |       +---jose
    |       |   |   constants.py
    |       |   |   exceptions.py
    |       |   |   jwe.py
    |       |   |   jwk.py
    |       |   |   jws.py
    |       |   |   jwt.py
    |       |   |   utils.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---backends
    |       |   |   |   base.py
    |       |   |   |   cryptography_backend.py
    |       |   |   |   ecdsa_backend.py
    |       |   |   |   native.py
    |       |   |   |   rsa_backend.py
    |       |   |   |   _asn1.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           cryptography_backend.cpython-312.pyc
    |       |   |           ecdsa_backend.cpython-312.pyc
    |       |   |           native.cpython-312.pyc
    |       |   |           rsa_backend.cpython-312.pyc
    |       |   |           _asn1.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           constants.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           jwe.cpython-312.pyc
    |       |           jwk.cpython-312.pyc
    |       |           jws.cpython-312.pyc
    |       |           jwt.cpython-312.pyc
    |       |           utils.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---multipart
    |       |   |   decoders.py
    |       |   |   exceptions.py
    |       |   |   multipart.py
    |       |   |   __init__.py
    |       |   |   
    |       |           decoders.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           multipart.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---numpy
    |       |   |   conftest.py
    |       |   |   dtypes.py
    |       |   |   dtypes.pyi
    |       |   |   exceptions.py
    |       |   |   exceptions.pyi
    |       |   |   matlib.py
    |       |   |   matlib.pyi
    |       |   |   py.typed
    |       |   |   version.py
    |       |   |   version.pyi
    |       |   |   _array_api_info.py
    |       |   |   _array_api_info.pyi
    |       |   |   _configtool.py
    |       |   |   _configtool.pyi
    |       |   |   _distributor_init.py
    |       |   |   _distributor_init.pyi
    |       |   |   _expired_attrs_2_0.py
    |       |   |   _expired_attrs_2_0.pyi
    |       |   |   _globals.py
    |       |   |   _globals.pyi
    |       |   |   _pytesttester.py
    |       |   |   _pytesttester.pyi
    |       |   |   __config__.py
    |       |   |   __config__.pyi
    |       |   |   __init__.cython-30.pxd
    |       |   |   __init__.pxd
    |       |   |   __init__.py
    |       |   |   __init__.pyi
    |       |   |   
    |       |   +---char
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---core
    |       |   |   |   arrayprint.py
    |       |   |   |   defchararray.py
    |       |   |   |   einsumfunc.py
    |       |   |   |   fromnumeric.py
    |       |   |   |   function_base.py
    |       |   |   |   getlimits.py
    |       |   |   |   multiarray.py
    |       |   |   |   numeric.py
    |       |   |   |   numerictypes.py
    |       |   |   |   overrides.py
    |       |   |   |   overrides.pyi
    |       |   |   |   records.py
    |       |   |   |   shape_base.py
    |       |   |   |   umath.py
    |       |   |   |   _dtype.py
    |       |   |   |   _dtype.pyi
    |       |   |   |   _dtype_ctypes.py
    |       |   |   |   _dtype_ctypes.pyi
    |       |   |   |   _internal.py
    |       |   |   |   _multiarray_umath.py
    |       |   |   |   _utils.py
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           arrayprint.cpython-312.pyc
    |       |   |           defchararray.cpython-312.pyc
    |       |   |           einsumfunc.cpython-312.pyc
    |       |   |           fromnumeric.cpython-312.pyc
    |       |   |           function_base.cpython-312.pyc
    |       |   |           getlimits.cpython-312.pyc
    |       |   |           multiarray.cpython-312.pyc
    |       |   |           numeric.cpython-312.pyc
    |       |   |           numerictypes.cpython-312.pyc
    |       |   |           overrides.cpython-312.pyc
    |       |   |           records.cpython-312.pyc
    |       |   |           shape_base.cpython-312.pyc
    |       |   |           umath.cpython-312.pyc
    |       |   |           _dtype.cpython-312.pyc
    |       |   |           _dtype_ctypes.cpython-312.pyc
    |       |   |           _internal.cpython-312.pyc
    |       |   |           _multiarray_umath.cpython-312.pyc
    |       |   |           _utils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---ctypeslib
    |       |   |   |   _ctypeslib.py
    |       |   |   |   _ctypeslib.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           _ctypeslib.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---doc
    |       |   |   |   ufuncs.py
    |       |   |   |   
    |       |   |           ufuncs.cpython-312.pyc
    |       |   |           
    |       |   +---f2py
    |       |   |   |   auxfuncs.py
    |       |   |   |   auxfuncs.pyi
    |       |   |   |   capi_maps.py
    |       |   |   |   capi_maps.pyi
    |       |   |   |   cb_rules.py
    |       |   |   |   cb_rules.pyi
    |       |   |   |   cfuncs.py
    |       |   |   |   cfuncs.pyi
    |       |   |   |   common_rules.py
    |       |   |   |   common_rules.pyi
    |       |   |   |   crackfortran.py
    |       |   |   |   crackfortran.pyi
    |       |   |   |   diagnose.py
    |       |   |   |   diagnose.pyi
    |       |   |   |   f2py2e.py
    |       |   |   |   f2py2e.pyi
    |       |   |   |   f90mod_rules.py
    |       |   |   |   f90mod_rules.pyi
    |       |   |   |   func2subr.py
    |       |   |   |   func2subr.pyi
    |       |   |   |   rules.py
    |       |   |   |   rules.pyi
    |       |   |   |   setup.cfg
    |       |   |   |   symbolic.py
    |       |   |   |   symbolic.pyi
    |       |   |   |   use_rules.py
    |       |   |   |   use_rules.pyi
    |       |   |   |   _isocbind.py
    |       |   |   |   _isocbind.pyi
    |       |   |   |   _src_pyf.py
    |       |   |   |   _src_pyf.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   __main__.py
    |       |   |   |   __version__.py
    |       |   |   |   __version__.pyi
    |       |   |   |   
    |       |   |   +---src
    |       |   |   |       fortranobject.c
    |       |   |   |       fortranobject.h
    |       |   |   |       
    |       |   |   +---tests
    |       |   |   |   |   test_abstract_interface.py
    |       |   |   |   |   test_array_from_pyobj.py
    |       |   |   |   |   test_assumed_shape.py
    |       |   |   |   |   test_block_docstring.py
    |       |   |   |   |   test_callback.py
    |       |   |   |   |   test_character.py
    |       |   |   |   |   test_common.py
    |       |   |   |   |   test_crackfortran.py
    |       |   |   |   |   test_data.py
    |       |   |   |   |   test_docs.py
    |       |   |   |   |   test_f2cmap.py
    |       |   |   |   |   test_f2py2e.py
    |       |   |   |   |   test_isoc.py
    |       |   |   |   |   test_kind.py
    |       |   |   |   |   test_mixed.py
    |       |   |   |   |   test_modules.py
    |       |   |   |   |   test_parameter.py
    |       |   |   |   |   test_pyf_src.py
    |       |   |   |   |   test_quoted_character.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   test_return_character.py
    |       |   |   |   |   test_return_complex.py
    |       |   |   |   |   test_return_integer.py
    |       |   |   |   |   test_return_logical.py
    |       |   |   |   |   test_return_real.py
    |       |   |   |   |   test_routines.py
    |       |   |   |   |   test_semicolon_split.py
    |       |   |   |   |   test_size.py
    |       |   |   |   |   test_string.py
    |       |   |   |   |   test_symbolic.py
    |       |   |   |   |   test_value_attrspec.py
    |       |   |   |   |   util.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---src
    |       |   |   |   |   +---abstract_interface
    |       |   |   |   |   |       foo.f90
    |       |   |   |   |   |       gh18403_mod.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---array_from_pyobj
    |       |   |   |   |   |       wrapmodule.c
    |       |   |   |   |   |       
    |       |   |   |   |   +---assumed_shape
    |       |   |   |   |   |       .f2py_f2cmap
    |       |   |   |   |   |       foo_free.f90
    |       |   |   |   |   |       foo_mod.f90
    |       |   |   |   |   |       foo_use.f90
    |       |   |   |   |   |       precision.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---block_docstring
    |       |   |   |   |   |       foo.f
    |       |   |   |   |   |       
    |       |   |   |   |   +---callback
    |       |   |   |   |   |       foo.f
    |       |   |   |   |   |       gh17797.f90
    |       |   |   |   |   |       gh18335.f90
    |       |   |   |   |   |       gh25211.f
    |       |   |   |   |   |       gh25211.pyf
    |       |   |   |   |   |       gh26681.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---cli
    |       |   |   |   |   |       gh_22819.pyf
    |       |   |   |   |   |       hi77.f
    |       |   |   |   |   |       hiworld.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---common
    |       |   |   |   |   |       block.f
    |       |   |   |   |   |       gh19161.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---crackfortran
    |       |   |   |   |   |       accesstype.f90
    |       |   |   |   |   |       common_with_division.f
    |       |   |   |   |   |       data_common.f
    |       |   |   |   |   |       data_multiplier.f
    |       |   |   |   |   |       data_stmts.f90
    |       |   |   |   |   |       data_with_comments.f
    |       |   |   |   |   |       foo_deps.f90
    |       |   |   |   |   |       gh15035.f
    |       |   |   |   |   |       gh17859.f
    |       |   |   |   |   |       gh22648.pyf
    |       |   |   |   |   |       gh23533.f
    |       |   |   |   |   |       gh23598.f90
    |       |   |   |   |   |       gh23598Warn.f90
    |       |   |   |   |   |       gh23879.f90
    |       |   |   |   |   |       gh27697.f90
    |       |   |   |   |   |       gh2848.f90
    |       |   |   |   |   |       operators.f90
    |       |   |   |   |   |       privatemod.f90
    |       |   |   |   |   |       publicmod.f90
    |       |   |   |   |   |       pubprivmod.f90
    |       |   |   |   |   |       unicode_comment.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---f2cmap
    |       |   |   |   |   |       .f2py_f2cmap
    |       |   |   |   |   |       isoFortranEnvMap.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---isocintrin
    |       |   |   |   |   |       isoCtests.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---kind
    |       |   |   |   |   |       foo.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---mixed
    |       |   |   |   |   |       foo.f
    |       |   |   |   |   |       foo_fixed.f90
    |       |   |   |   |   |       foo_free.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---modules
    |       |   |   |   |   |   |   module_data_docstring.f90
    |       |   |   |   |   |   |   use_modules.f90
    |       |   |   |   |   |   |   
    |       |   |   |   |   |   +---gh25337
    |       |   |   |   |   |   |       data.f90
    |       |   |   |   |   |   |       use_data.f90
    |       |   |   |   |   |   |       
    |       |   |   |   |   |   \---gh26920
    |       |   |   |   |   |           two_mods_with_no_public_entities.f90
    |       |   |   |   |   |           two_mods_with_one_public_routine.f90
    |       |   |   |   |   |           
    |       |   |   |   |   +---negative_bounds
    |       |   |   |   |   |       issue_20853.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---parameter
    |       |   |   |   |   |       constant_array.f90
    |       |   |   |   |   |       constant_both.f90
    |       |   |   |   |   |       constant_compound.f90
    |       |   |   |   |   |       constant_integer.f90
    |       |   |   |   |   |       constant_non_compound.f90
    |       |   |   |   |   |       constant_real.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---quoted_character
    |       |   |   |   |   |       foo.f
    |       |   |   |   |   |       
    |       |   |   |   |   +---regression
    |       |   |   |   |   |       AB.inc
    |       |   |   |   |   |       assignOnlyModule.f90
    |       |   |   |   |   |       datonly.f90
    |       |   |   |   |   |       f77comments.f
    |       |   |   |   |   |       f77fixedform.f95
    |       |   |   |   |   |       f90continuation.f90
    |       |   |   |   |   |       incfile.f90
    |       |   |   |   |   |       inout.f90
    |       |   |   |   |   |       lower_f2py_fortran.f90
    |       |   |   |   |   |       mod_derived_types.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---return_character
    |       |   |   |   |   |       foo77.f
    |       |   |   |   |   |       foo90.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---return_complex
    |       |   |   |   |   |       foo77.f
    |       |   |   |   |   |       foo90.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---return_integer
    |       |   |   |   |   |       foo77.f
    |       |   |   |   |   |       foo90.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---return_logical
    |       |   |   |   |   |       foo77.f
    |       |   |   |   |   |       foo90.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---return_real
    |       |   |   |   |   |       foo77.f
    |       |   |   |   |   |       foo90.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---routines
    |       |   |   |   |   |       funcfortranname.f
    |       |   |   |   |   |       funcfortranname.pyf
    |       |   |   |   |   |       subrout.f
    |       |   |   |   |   |       subrout.pyf
    |       |   |   |   |   |       
    |       |   |   |   |   +---size
    |       |   |   |   |   |       foo.f90
    |       |   |   |   |   |       
    |       |   |   |   |   +---string
    |       |   |   |   |   |       char.f90
    |       |   |   |   |   |       fixed_string.f90
    |       |   |   |   |   |       gh24008.f
    |       |   |   |   |   |       gh24662.f90
    |       |   |   |   |   |       gh25286.f90
    |       |   |   |   |   |       gh25286.pyf
    |       |   |   |   |   |       gh25286_bc.pyf
    |       |   |   |   |   |       scalar_string.f90
    |       |   |   |   |   |       string.f
    |       |   |   |   |   |       
    |       |   |   |   |   \---value_attrspec
    |       |   |   |   |           gh21665.f90
    |       |   |   |   |           
    |       |   |   |           test_abstract_interface.cpython-312.pyc
    |       |   |   |           test_array_from_pyobj.cpython-312.pyc
    |       |   |   |           test_assumed_shape.cpython-312.pyc
    |       |   |   |           test_block_docstring.cpython-312.pyc
    |       |   |   |           test_callback.cpython-312.pyc
    |       |   |   |           test_character.cpython-312.pyc
    |       |   |   |           test_common.cpython-312.pyc
    |       |   |   |           test_crackfortran.cpython-312.pyc
    |       |   |   |           test_data.cpython-312.pyc
    |       |   |   |           test_docs.cpython-312.pyc
    |       |   |   |           test_f2cmap.cpython-312.pyc
    |       |   |   |           test_f2py2e.cpython-312.pyc
    |       |   |   |           test_isoc.cpython-312.pyc
    |       |   |   |           test_kind.cpython-312.pyc
    |       |   |   |           test_mixed.cpython-312.pyc
    |       |   |   |           test_modules.cpython-312.pyc
    |       |   |   |           test_parameter.cpython-312.pyc
    |       |   |   |           test_pyf_src.cpython-312.pyc
    |       |   |   |           test_quoted_character.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           test_return_character.cpython-312.pyc
    |       |   |   |           test_return_complex.cpython-312.pyc
    |       |   |   |           test_return_integer.cpython-312.pyc
    |       |   |   |           test_return_logical.cpython-312.pyc
    |       |   |   |           test_return_real.cpython-312.pyc
    |       |   |   |           test_routines.cpython-312.pyc
    |       |   |   |           test_semicolon_split.cpython-312.pyc
    |       |   |   |           test_size.cpython-312.pyc
    |       |   |   |           test_string.cpython-312.pyc
    |       |   |   |           test_symbolic.cpython-312.pyc
    |       |   |   |           test_value_attrspec.cpython-312.pyc
    |       |   |   |           util.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---_backends
    |       |   |   |   |   meson.build.template
    |       |   |   |   |   _backend.py
    |       |   |   |   |   _backend.pyi
    |       |   |   |   |   _distutils.py
    |       |   |   |   |   _distutils.pyi
    |       |   |   |   |   _meson.py
    |       |   |   |   |   _meson.pyi
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __init__.pyi
    |       |   |   |   |   
    |       |   |   |           _backend.cpython-312.pyc
    |       |   |   |           _distutils.cpython-312.pyc
    |       |   |   |           _meson.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           auxfuncs.cpython-312.pyc
    |       |   |           capi_maps.cpython-312.pyc
    |       |   |           cb_rules.cpython-312.pyc
    |       |   |           cfuncs.cpython-312.pyc
    |       |   |           common_rules.cpython-312.pyc
    |       |   |           crackfortran.cpython-312.pyc
    |       |   |           diagnose.cpython-312.pyc
    |       |   |           f2py2e.cpython-312.pyc
    |       |   |           f90mod_rules.cpython-312.pyc
    |       |   |           func2subr.cpython-312.pyc
    |       |   |           rules.cpython-312.pyc
    |       |   |           symbolic.cpython-312.pyc
    |       |   |           use_rules.cpython-312.pyc
    |       |   |           _isocbind.cpython-312.pyc
    |       |   |           _src_pyf.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           __main__.cpython-312.pyc
    |       |   |           __version__.cpython-312.pyc
    |       |   |           
    |       |   +---fft
    |       |   |   |   _helper.py
    |       |   |   |   _helper.pyi
    |       |   |   |   _pocketfft.py
    |       |   |   |   _pocketfft.pyi
    |       |   |   |   _pocketfft_umath.cp312-win_amd64.lib
    |       |   |   |   _pocketfft_umath.cp312-win_amd64.pyd
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_helper.py
    |       |   |   |   |   test_pocketfft.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_helper.cpython-312.pyc
    |       |   |   |           test_pocketfft.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           _helper.cpython-312.pyc
    |       |   |           _pocketfft.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---lib
    |       |   |   |   array_utils.py
    |       |   |   |   array_utils.pyi
    |       |   |   |   format.py
    |       |   |   |   format.pyi
    |       |   |   |   introspect.py
    |       |   |   |   introspect.pyi
    |       |   |   |   mixins.py
    |       |   |   |   mixins.pyi
    |       |   |   |   npyio.py
    |       |   |   |   npyio.pyi
    |       |   |   |   recfunctions.py
    |       |   |   |   recfunctions.pyi
    |       |   |   |   scimath.py
    |       |   |   |   scimath.pyi
    |       |   |   |   stride_tricks.py
    |       |   |   |   stride_tricks.pyi
    |       |   |   |   user_array.py
    |       |   |   |   user_array.pyi
    |       |   |   |   _arraypad_impl.py
    |       |   |   |   _arraypad_impl.pyi
    |       |   |   |   _arraysetops_impl.py
    |       |   |   |   _arraysetops_impl.pyi
    |       |   |   |   _arrayterator_impl.py
    |       |   |   |   _arrayterator_impl.pyi
    |       |   |   |   _array_utils_impl.py
    |       |   |   |   _array_utils_impl.pyi
    |       |   |   |   _datasource.py
    |       |   |   |   _datasource.pyi
    |       |   |   |   _format_impl.py
    |       |   |   |   _format_impl.pyi
    |       |   |   |   _function_base_impl.py
    |       |   |   |   _function_base_impl.pyi
    |       |   |   |   _histograms_impl.py
    |       |   |   |   _histograms_impl.pyi
    |       |   |   |   _index_tricks_impl.py
    |       |   |   |   _index_tricks_impl.pyi
    |       |   |   |   _iotools.py
    |       |   |   |   _iotools.pyi
    |       |   |   |   _nanfunctions_impl.py
    |       |   |   |   _nanfunctions_impl.pyi
    |       |   |   |   _npyio_impl.py
    |       |   |   |   _npyio_impl.pyi
    |       |   |   |   _polynomial_impl.py
    |       |   |   |   _polynomial_impl.pyi
    |       |   |   |   _scimath_impl.py
    |       |   |   |   _scimath_impl.pyi
    |       |   |   |   _shape_base_impl.py
    |       |   |   |   _shape_base_impl.pyi
    |       |   |   |   _stride_tricks_impl.py
    |       |   |   |   _stride_tricks_impl.pyi
    |       |   |   |   _twodim_base_impl.py
    |       |   |   |   _twodim_base_impl.pyi
    |       |   |   |   _type_check_impl.py
    |       |   |   |   _type_check_impl.pyi
    |       |   |   |   _ufunclike_impl.py
    |       |   |   |   _ufunclike_impl.pyi
    |       |   |   |   _user_array_impl.py
    |       |   |   |   _user_array_impl.pyi
    |       |   |   |   _utils_impl.py
    |       |   |   |   _utils_impl.pyi
    |       |   |   |   _version.py
    |       |   |   |   _version.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_arraypad.py
    |       |   |   |   |   test_arraysetops.py
    |       |   |   |   |   test_arrayterator.py
    |       |   |   |   |   test_array_utils.py
    |       |   |   |   |   test_format.py
    |       |   |   |   |   test_function_base.py
    |       |   |   |   |   test_histograms.py
    |       |   |   |   |   test_index_tricks.py
    |       |   |   |   |   test_io.py
    |       |   |   |   |   test_loadtxt.py
    |       |   |   |   |   test_mixins.py
    |       |   |   |   |   test_nanfunctions.py
    |       |   |   |   |   test_packbits.py
    |       |   |   |   |   test_polynomial.py
    |       |   |   |   |   test_recfunctions.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   test_shape_base.py
    |       |   |   |   |   test_stride_tricks.py
    |       |   |   |   |   test_twodim_base.py
    |       |   |   |   |   test_type_check.py
    |       |   |   |   |   test_ufunclike.py
    |       |   |   |   |   test_utils.py
    |       |   |   |   |   test__datasource.py
    |       |   |   |   |   test__iotools.py
    |       |   |   |   |   test__version.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---data
    |       |   |   |   |       py2-np0-objarr.npy
    |       |   |   |   |       py2-objarr.npy
    |       |   |   |   |       py2-objarr.npz
    |       |   |   |   |       py3-objarr.npy
    |       |   |   |   |       py3-objarr.npz
    |       |   |   |   |       python3.npy
    |       |   |   |   |       win64python2.npy
    |       |   |   |   |       
    |       |   |   |           test_arraypad.cpython-312.pyc
    |       |   |   |           test_arraysetops.cpython-312.pyc
    |       |   |   |           test_arrayterator.cpython-312.pyc
    |       |   |   |           test_array_utils.cpython-312.pyc
    |       |   |   |           test_format.cpython-312.pyc
    |       |   |   |           test_function_base.cpython-312.pyc
    |       |   |   |           test_histograms.cpython-312.pyc
    |       |   |   |           test_index_tricks.cpython-312.pyc
    |       |   |   |           test_io.cpython-312.pyc
    |       |   |   |           test_loadtxt.cpython-312.pyc
    |       |   |   |           test_mixins.cpython-312.pyc
    |       |   |   |           test_nanfunctions.cpython-312.pyc
    |       |   |   |           test_packbits.cpython-312.pyc
    |       |   |   |           test_polynomial.cpython-312.pyc
    |       |   |   |           test_recfunctions.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           test_shape_base.cpython-312.pyc
    |       |   |   |           test_stride_tricks.cpython-312.pyc
    |       |   |   |           test_twodim_base.cpython-312.pyc
    |       |   |   |           test_type_check.cpython-312.pyc
    |       |   |   |           test_ufunclike.cpython-312.pyc
    |       |   |   |           test_utils.cpython-312.pyc
    |       |   |   |           test__datasource.cpython-312.pyc
    |       |   |   |           test__iotools.cpython-312.pyc
    |       |   |   |           test__version.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           array_utils.cpython-312.pyc
    |       |   |           format.cpython-312.pyc
    |       |   |           introspect.cpython-312.pyc
    |       |   |           mixins.cpython-312.pyc
    |       |   |           npyio.cpython-312.pyc
    |       |   |           recfunctions.cpython-312.pyc
    |       |   |           scimath.cpython-312.pyc
    |       |   |           stride_tricks.cpython-312.pyc
    |       |   |           user_array.cpython-312.pyc
    |       |   |           _arraypad_impl.cpython-312.pyc
    |       |   |           _arraysetops_impl.cpython-312.pyc
    |       |   |           _arrayterator_impl.cpython-312.pyc
    |       |   |           _array_utils_impl.cpython-312.pyc
    |       |   |           _datasource.cpython-312.pyc
    |       |   |           _format_impl.cpython-312.pyc
    |       |   |           _function_base_impl.cpython-312.pyc
    |       |   |           _histograms_impl.cpython-312.pyc
    |       |   |           _index_tricks_impl.cpython-312.pyc
    |       |   |           _iotools.cpython-312.pyc
    |       |   |           _nanfunctions_impl.cpython-312.pyc
    |       |   |           _npyio_impl.cpython-312.pyc
    |       |   |           _polynomial_impl.cpython-312.pyc
    |       |   |           _scimath_impl.cpython-312.pyc
    |       |   |           _shape_base_impl.cpython-312.pyc
    |       |   |           _stride_tricks_impl.cpython-312.pyc
    |       |   |           _twodim_base_impl.cpython-312.pyc
    |       |   |           _type_check_impl.cpython-312.pyc
    |       |   |           _ufunclike_impl.cpython-312.pyc
    |       |   |           _user_array_impl.cpython-312.pyc
    |       |   |           _utils_impl.cpython-312.pyc
    |       |   |           _version.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---linalg
    |       |   |   |   lapack_lite.cp312-win_amd64.lib
    |       |   |   |   lapack_lite.cp312-win_amd64.pyd
    |       |   |   |   lapack_lite.pyi
    |       |   |   |   _linalg.py
    |       |   |   |   _linalg.pyi
    |       |   |   |   _umath_linalg.cp312-win_amd64.lib
    |       |   |   |   _umath_linalg.cp312-win_amd64.pyd
    |       |   |   |   _umath_linalg.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_deprecations.py
    |       |   |   |   |   test_linalg.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_deprecations.cpython-312.pyc
    |       |   |   |           test_linalg.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           _linalg.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---ma
    |       |   |   |   API_CHANGES.txt
    |       |   |   |   core.py
    |       |   |   |   core.pyi
    |       |   |   |   extras.py
    |       |   |   |   extras.pyi
    |       |   |   |   LICENSE
    |       |   |   |   mrecords.py
    |       |   |   |   mrecords.pyi
    |       |   |   |   README.rst
    |       |   |   |   testutils.py
    |       |   |   |   testutils.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_arrayobject.py
    |       |   |   |   |   test_core.py
    |       |   |   |   |   test_deprecations.py
    |       |   |   |   |   test_extras.py
    |       |   |   |   |   test_mrecords.py
    |       |   |   |   |   test_old_ma.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   test_subclassing.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_arrayobject.cpython-312.pyc
    |       |   |   |           test_core.cpython-312.pyc
    |       |   |   |           test_deprecations.cpython-312.pyc
    |       |   |   |           test_extras.cpython-312.pyc
    |       |   |   |           test_mrecords.cpython-312.pyc
    |       |   |   |           test_old_ma.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           test_subclassing.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           core.cpython-312.pyc
    |       |   |           extras.cpython-312.pyc
    |       |   |           mrecords.cpython-312.pyc
    |       |   |           testutils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---matrixlib
    |       |   |   |   defmatrix.py
    |       |   |   |   defmatrix.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_defmatrix.py
    |       |   |   |   |   test_interaction.py
    |       |   |   |   |   test_masked_matrix.py
    |       |   |   |   |   test_matrix_linalg.py
    |       |   |   |   |   test_multiarray.py
    |       |   |   |   |   test_numeric.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_defmatrix.cpython-312.pyc
    |       |   |   |           test_interaction.cpython-312.pyc
    |       |   |   |           test_masked_matrix.cpython-312.pyc
    |       |   |   |           test_matrix_linalg.cpython-312.pyc
    |       |   |   |           test_multiarray.cpython-312.pyc
    |       |   |   |           test_numeric.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           defmatrix.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---polynomial
    |       |   |   |   chebyshev.py
    |       |   |   |   chebyshev.pyi
    |       |   |   |   hermite.py
    |       |   |   |   hermite.pyi
    |       |   |   |   hermite_e.py
    |       |   |   |   hermite_e.pyi
    |       |   |   |   laguerre.py
    |       |   |   |   laguerre.pyi
    |       |   |   |   legendre.py
    |       |   |   |   legendre.pyi
    |       |   |   |   polynomial.py
    |       |   |   |   polynomial.pyi
    |       |   |   |   polyutils.py
    |       |   |   |   polyutils.pyi
    |       |   |   |   _polybase.py
    |       |   |   |   _polybase.pyi
    |       |   |   |   _polytypes.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_chebyshev.py
    |       |   |   |   |   test_classes.py
    |       |   |   |   |   test_hermite.py
    |       |   |   |   |   test_hermite_e.py
    |       |   |   |   |   test_laguerre.py
    |       |   |   |   |   test_legendre.py
    |       |   |   |   |   test_polynomial.py
    |       |   |   |   |   test_polyutils.py
    |       |   |   |   |   test_printing.py
    |       |   |   |   |   test_symbol.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_chebyshev.cpython-312.pyc
    |       |   |   |           test_classes.cpython-312.pyc
    |       |   |   |           test_hermite.cpython-312.pyc
    |       |   |   |           test_hermite_e.cpython-312.pyc
    |       |   |   |           test_laguerre.cpython-312.pyc
    |       |   |   |           test_legendre.cpython-312.pyc
    |       |   |   |           test_polynomial.cpython-312.pyc
    |       |   |   |           test_polyutils.cpython-312.pyc
    |       |   |   |           test_printing.cpython-312.pyc
    |       |   |   |           test_symbol.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           chebyshev.cpython-312.pyc
    |       |   |           hermite.cpython-312.pyc
    |       |   |           hermite_e.cpython-312.pyc
    |       |   |           laguerre.cpython-312.pyc
    |       |   |           legendre.cpython-312.pyc
    |       |   |           polynomial.cpython-312.pyc
    |       |   |           polyutils.cpython-312.pyc
    |       |   |           _polybase.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---random
    |       |   |   |   bit_generator.cp312-win_amd64.lib
    |       |   |   |   bit_generator.cp312-win_amd64.pyd
    |       |   |   |   bit_generator.pxd
    |       |   |   |   bit_generator.pyi
    |       |   |   |   c_distributions.pxd
    |       |   |   |   LICENSE.md
    |       |   |   |   mtrand.cp312-win_amd64.lib
    |       |   |   |   mtrand.cp312-win_amd64.pyd
    |       |   |   |   mtrand.pyi
    |       |   |   |   _bounded_integers.cp312-win_amd64.lib
    |       |   |   |   _bounded_integers.cp312-win_amd64.pyd
    |       |   |   |   _bounded_integers.pxd
    |       |   |   |   _bounded_integers.pyi
    |       |   |   |   _common.cp312-win_amd64.lib
    |       |   |   |   _common.cp312-win_amd64.pyd
    |       |   |   |   _common.pxd
    |       |   |   |   _common.pyi
    |       |   |   |   _generator.cp312-win_amd64.lib
    |       |   |   |   _generator.cp312-win_amd64.pyd
    |       |   |   |   _generator.pyi
    |       |   |   |   _mt19937.cp312-win_amd64.lib
    |       |   |   |   _mt19937.cp312-win_amd64.pyd
    |       |   |   |   _mt19937.pyi
    |       |   |   |   _pcg64.cp312-win_amd64.lib
    |       |   |   |   _pcg64.cp312-win_amd64.pyd
    |       |   |   |   _pcg64.pyi
    |       |   |   |   _philox.cp312-win_amd64.lib
    |       |   |   |   _philox.cp312-win_amd64.pyd
    |       |   |   |   _philox.pyi
    |       |   |   |   _pickle.py
    |       |   |   |   _pickle.pyi
    |       |   |   |   _sfc64.cp312-win_amd64.lib
    |       |   |   |   _sfc64.cp312-win_amd64.pyd
    |       |   |   |   _sfc64.pyi
    |       |   |   |   __init__.pxd
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---lib
    |       |   |   |       npyrandom.lib
    |       |   |   |       
    |       |   |   +---tests
    |       |   |   |   |   test_direct.py
    |       |   |   |   |   test_extending.py
    |       |   |   |   |   test_generator_mt19937.py
    |       |   |   |   |   test_generator_mt19937_regressions.py
    |       |   |   |   |   test_random.py
    |       |   |   |   |   test_randomstate.py
    |       |   |   |   |   test_randomstate_regression.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   test_seed_sequence.py
    |       |   |   |   |   test_smoke.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---data
    |       |   |   |   |   |   generator_pcg64_np121.pkl.gz
    |       |   |   |   |   |   generator_pcg64_np126.pkl.gz
    |       |   |   |   |   |   mt19937-testset-1.csv
    |       |   |   |   |   |   mt19937-testset-2.csv
    |       |   |   |   |   |   pcg64-testset-1.csv
    |       |   |   |   |   |   pcg64-testset-2.csv
    |       |   |   |   |   |   pcg64dxsm-testset-1.csv
    |       |   |   |   |   |   pcg64dxsm-testset-2.csv
    |       |   |   |   |   |   philox-testset-1.csv
    |       |   |   |   |   |   philox-testset-2.csv
    |       |   |   |   |   |   sfc64-testset-1.csv
    |       |   |   |   |   |   sfc64-testset-2.csv
    |       |   |   |   |   |   sfc64_np126.pkl.gz
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           test_direct.cpython-312.pyc
    |       |   |   |           test_extending.cpython-312.pyc
    |       |   |   |           test_generator_mt19937.cpython-312.pyc
    |       |   |   |           test_generator_mt19937_regressions.cpython-312.pyc
    |       |   |   |           test_random.cpython-312.pyc
    |       |   |   |           test_randomstate.cpython-312.pyc
    |       |   |   |           test_randomstate_regression.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           test_seed_sequence.cpython-312.pyc
    |       |   |   |           test_smoke.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---_examples
    |       |   |   |   +---cffi
    |       |   |   |   |   |   extending.py
    |       |   |   |   |   |   parse.py
    |       |   |   |   |   |   
    |       |   |   |   |           extending.cpython-312.pyc
    |       |   |   |   |           parse.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---cython
    |       |   |   |   |       extending.pyx
    |       |   |   |   |       extending_distributions.pyx
    |       |   |   |   |       meson.build
    |       |   |   |   |       
    |       |   |   |   \---numba
    |       |   |   |       |   extending.py
    |       |   |   |       |   extending_distributions.py
    |       |   |   |       |   
    |       |   |   |               extending.cpython-312.pyc
    |       |   |   |               extending_distributions.cpython-312.pyc
    |       |   |   |               
    |       |   |           _pickle.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---rec
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---strings
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---testing
    |       |   |   |   overrides.py
    |       |   |   |   overrides.pyi
    |       |   |   |   print_coercion_tables.py
    |       |   |   |   print_coercion_tables.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_utils.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_utils.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---_private
    |       |   |   |   |   extbuild.py
    |       |   |   |   |   extbuild.pyi
    |       |   |   |   |   utils.py
    |       |   |   |   |   utils.pyi
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __init__.pyi
    |       |   |   |   |   
    |       |   |   |           extbuild.cpython-312.pyc
    |       |   |   |           utils.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           overrides.cpython-312.pyc
    |       |   |           print_coercion_tables.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---tests
    |       |   |   |   test_configtool.py
    |       |   |   |   test_ctypeslib.py
    |       |   |   |   test_lazyloading.py
    |       |   |   |   test_matlib.py
    |       |   |   |   test_numpy_config.py
    |       |   |   |   test_numpy_version.py
    |       |   |   |   test_public_api.py
    |       |   |   |   test_reloading.py
    |       |   |   |   test_scripts.py
    |       |   |   |   test_warnings.py
    |       |   |   |   test__all__.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           test_configtool.cpython-312.pyc
    |       |   |           test_ctypeslib.cpython-312.pyc
    |       |   |           test_lazyloading.cpython-312.pyc
    |       |   |           test_matlib.cpython-312.pyc
    |       |   |           test_numpy_config.cpython-312.pyc
    |       |   |           test_numpy_version.cpython-312.pyc
    |       |   |           test_public_api.cpython-312.pyc
    |       |   |           test_reloading.cpython-312.pyc
    |       |   |           test_scripts.cpython-312.pyc
    |       |   |           test_warnings.cpython-312.pyc
    |       |   |           test__all__.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---typing
    |       |   |   |   mypy_plugin.py
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   test_isfile.py
    |       |   |   |   |   test_runtime.py
    |       |   |   |   |   test_typing.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---data
    |       |   |   |   |   |   mypy.ini
    |       |   |   |   |   |   
    |       |   |   |   |   +---fail
    |       |   |   |   |   |       arithmetic.pyi
    |       |   |   |   |   |       arrayprint.pyi
    |       |   |   |   |   |       arrayterator.pyi
    |       |   |   |   |   |       array_constructors.pyi
    |       |   |   |   |   |       array_like.pyi
    |       |   |   |   |   |       array_pad.pyi
    |       |   |   |   |   |       bitwise_ops.pyi
    |       |   |   |   |   |       char.pyi
    |       |   |   |   |   |       chararray.pyi
    |       |   |   |   |   |       comparisons.pyi
    |       |   |   |   |   |       constants.pyi
    |       |   |   |   |   |       datasource.pyi
    |       |   |   |   |   |       dtype.pyi
    |       |   |   |   |   |       einsumfunc.pyi
    |       |   |   |   |   |       flatiter.pyi
    |       |   |   |   |   |       fromnumeric.pyi
    |       |   |   |   |   |       histograms.pyi
    |       |   |   |   |   |       index_tricks.pyi
    |       |   |   |   |   |       lib_function_base.pyi
    |       |   |   |   |   |       lib_polynomial.pyi
    |       |   |   |   |   |       lib_utils.pyi
    |       |   |   |   |   |       lib_version.pyi
    |       |   |   |   |   |       linalg.pyi
    |       |   |   |   |   |       ma.pyi
    |       |   |   |   |   |       memmap.pyi
    |       |   |   |   |   |       modules.pyi
    |       |   |   |   |   |       multiarray.pyi
    |       |   |   |   |   |       ndarray.pyi
    |       |   |   |   |   |       ndarray_misc.pyi
    |       |   |   |   |   |       nditer.pyi
    |       |   |   |   |   |       nested_sequence.pyi
    |       |   |   |   |   |       npyio.pyi
    |       |   |   |   |   |       numerictypes.pyi
    |       |   |   |   |   |       random.pyi
    |       |   |   |   |   |       rec.pyi
    |       |   |   |   |   |       scalars.pyi
    |       |   |   |   |   |       shape.pyi
    |       |   |   |   |   |       shape_base.pyi
    |       |   |   |   |   |       stride_tricks.pyi
    |       |   |   |   |   |       strings.pyi
    |       |   |   |   |   |       testing.pyi
    |       |   |   |   |   |       twodim_base.pyi
    |       |   |   |   |   |       type_check.pyi
    |       |   |   |   |   |       ufunclike.pyi
    |       |   |   |   |   |       ufuncs.pyi
    |       |   |   |   |   |       ufunc_config.pyi
    |       |   |   |   |   |       warnings_and_errors.pyi
    |       |   |   |   |   |       
    |       |   |   |   |   +---misc
    |       |   |   |   |   |       extended_precision.pyi
    |       |   |   |   |   |       
    |       |   |   |   |   +---pass
    |       |   |   |   |   |   |   arithmetic.py
    |       |   |   |   |   |   |   arrayprint.py
    |       |   |   |   |   |   |   arrayterator.py
    |       |   |   |   |   |   |   array_constructors.py
    |       |   |   |   |   |   |   array_like.py
    |       |   |   |   |   |   |   bitwise_ops.py
    |       |   |   |   |   |   |   comparisons.py
    |       |   |   |   |   |   |   dtype.py
    |       |   |   |   |   |   |   einsumfunc.py
    |       |   |   |   |   |   |   flatiter.py
    |       |   |   |   |   |   |   fromnumeric.py
    |       |   |   |   |   |   |   index_tricks.py
    |       |   |   |   |   |   |   lib_user_array.py
    |       |   |   |   |   |   |   lib_utils.py
    |       |   |   |   |   |   |   lib_version.py
    |       |   |   |   |   |   |   literal.py
    |       |   |   |   |   |   |   ma.py
    |       |   |   |   |   |   |   mod.py
    |       |   |   |   |   |   |   modules.py
    |       |   |   |   |   |   |   multiarray.py
    |       |   |   |   |   |   |   ndarray_conversion.py
    |       |   |   |   |   |   |   ndarray_misc.py
    |       |   |   |   |   |   |   ndarray_shape_manipulation.py
    |       |   |   |   |   |   |   nditer.py
    |       |   |   |   |   |   |   numeric.py
    |       |   |   |   |   |   |   numerictypes.py
    |       |   |   |   |   |   |   random.py
    |       |   |   |   |   |   |   recfunctions.py
    |       |   |   |   |   |   |   scalars.py
    |       |   |   |   |   |   |   shape.py
    |       |   |   |   |   |   |   simple.py
    |       |   |   |   |   |   |   ufunclike.py
    |       |   |   |   |   |   |   ufuncs.py
    |       |   |   |   |   |   |   ufunc_config.py
    |       |   |   |   |   |   |   warnings_and_errors.py
    |       |   |   |   |   |   |   
    |       |   |   |   |   |           arithmetic.cpython-312.pyc
    |       |   |   |   |   |           arrayprint.cpython-312.pyc
    |       |   |   |   |   |           arrayterator.cpython-312.pyc
    |       |   |   |   |   |           array_constructors.cpython-312.pyc
    |       |   |   |   |   |           array_like.cpython-312.pyc
    |       |   |   |   |   |           bitwise_ops.cpython-312.pyc
    |       |   |   |   |   |           comparisons.cpython-312.pyc
    |       |   |   |   |   |           dtype.cpython-312.pyc
    |       |   |   |   |   |           einsumfunc.cpython-312.pyc
    |       |   |   |   |   |           flatiter.cpython-312.pyc
    |       |   |   |   |   |           fromnumeric.cpython-312.pyc
    |       |   |   |   |   |           index_tricks.cpython-312.pyc
    |       |   |   |   |   |           lib_user_array.cpython-312.pyc
    |       |   |   |   |   |           lib_utils.cpython-312.pyc
    |       |   |   |   |   |           lib_version.cpython-312.pyc
    |       |   |   |   |   |           literal.cpython-312.pyc
    |       |   |   |   |   |           ma.cpython-312.pyc
    |       |   |   |   |   |           mod.cpython-312.pyc
    |       |   |   |   |   |           modules.cpython-312.pyc
    |       |   |   |   |   |           multiarray.cpython-312.pyc
    |       |   |   |   |   |           ndarray_conversion.cpython-312.pyc
    |       |   |   |   |   |           ndarray_misc.cpython-312.pyc
    |       |   |   |   |   |           ndarray_shape_manipulation.cpython-312.pyc
    |       |   |   |   |   |           nditer.cpython-312.pyc
    |       |   |   |   |   |           numeric.cpython-312.pyc
    |       |   |   |   |   |           numerictypes.cpython-312.pyc
    |       |   |   |   |   |           random.cpython-312.pyc
    |       |   |   |   |   |           recfunctions.cpython-312.pyc
    |       |   |   |   |   |           scalars.cpython-312.pyc
    |       |   |   |   |   |           shape.cpython-312.pyc
    |       |   |   |   |   |           simple.cpython-312.pyc
    |       |   |   |   |   |           ufunclike.cpython-312.pyc
    |       |   |   |   |   |           ufuncs.cpython-312.pyc
    |       |   |   |   |   |           ufunc_config.cpython-312.pyc
    |       |   |   |   |   |           warnings_and_errors.cpython-312.pyc
    |       |   |   |   |   |           
    |       |   |   |   |   \---reveal
    |       |   |   |   |           arithmetic.pyi
    |       |   |   |   |           arraypad.pyi
    |       |   |   |   |           arrayprint.pyi
    |       |   |   |   |           arraysetops.pyi
    |       |   |   |   |           arrayterator.pyi
    |       |   |   |   |           array_api_info.pyi
    |       |   |   |   |           array_constructors.pyi
    |       |   |   |   |           bitwise_ops.pyi
    |       |   |   |   |           char.pyi
    |       |   |   |   |           chararray.pyi
    |       |   |   |   |           comparisons.pyi
    |       |   |   |   |           constants.pyi
    |       |   |   |   |           ctypeslib.pyi
    |       |   |   |   |           datasource.pyi
    |       |   |   |   |           dtype.pyi
    |       |   |   |   |           einsumfunc.pyi
    |       |   |   |   |           emath.pyi
    |       |   |   |   |           fft.pyi
    |       |   |   |   |           flatiter.pyi
    |       |   |   |   |           fromnumeric.pyi
    |       |   |   |   |           getlimits.pyi
    |       |   |   |   |           histograms.pyi
    |       |   |   |   |           index_tricks.pyi
    |       |   |   |   |           lib_function_base.pyi
    |       |   |   |   |           lib_polynomial.pyi
    |       |   |   |   |           lib_utils.pyi
    |       |   |   |   |           lib_version.pyi
    |       |   |   |   |           linalg.pyi
    |       |   |   |   |           ma.pyi
    |       |   |   |   |           matrix.pyi
    |       |   |   |   |           memmap.pyi
    |       |   |   |   |           mod.pyi
    |       |   |   |   |           modules.pyi
    |       |   |   |   |           multiarray.pyi
    |       |   |   |   |           nbit_base_example.pyi
    |       |   |   |   |           ndarray_assignability.pyi
    |       |   |   |   |           ndarray_conversion.pyi
    |       |   |   |   |           ndarray_misc.pyi
    |       |   |   |   |           ndarray_shape_manipulation.pyi
    |       |   |   |   |           nditer.pyi
    |       |   |   |   |           nested_sequence.pyi
    |       |   |   |   |           npyio.pyi
    |       |   |   |   |           numeric.pyi
    |       |   |   |   |           numerictypes.pyi
    |       |   |   |   |           polynomial_polybase.pyi
    |       |   |   |   |           polynomial_polyutils.pyi
    |       |   |   |   |           polynomial_series.pyi
    |       |   |   |   |           random.pyi
    |       |   |   |   |           rec.pyi
    |       |   |   |   |           scalars.pyi
    |       |   |   |   |           shape.pyi
    |       |   |   |   |           shape_base.pyi
    |       |   |   |   |           stride_tricks.pyi
    |       |   |   |   |           strings.pyi
    |       |   |   |   |           testing.pyi
    |       |   |   |   |           twodim_base.pyi
    |       |   |   |   |           type_check.pyi
    |       |   |   |   |           ufunclike.pyi
    |       |   |   |   |           ufuncs.pyi
    |       |   |   |   |           ufunc_config.pyi
    |       |   |   |   |           warnings_and_errors.pyi
    |       |   |   |   |           
    |       |   |   |           test_isfile.cpython-312.pyc
    |       |   |   |           test_runtime.cpython-312.pyc
    |       |   |   |           test_typing.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           mypy_plugin.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_core
    |       |   |   |   arrayprint.py
    |       |   |   |   arrayprint.pyi
    |       |   |   |   cversions.py
    |       |   |   |   defchararray.py
    |       |   |   |   defchararray.pyi
    |       |   |   |   einsumfunc.py
    |       |   |   |   einsumfunc.pyi
    |       |   |   |   fromnumeric.py
    |       |   |   |   fromnumeric.pyi
    |       |   |   |   function_base.py
    |       |   |   |   function_base.pyi
    |       |   |   |   getlimits.py
    |       |   |   |   getlimits.pyi
    |       |   |   |   memmap.py
    |       |   |   |   memmap.pyi
    |       |   |   |   multiarray.py
    |       |   |   |   multiarray.pyi
    |       |   |   |   numeric.py
    |       |   |   |   numeric.pyi
    |       |   |   |   numerictypes.py
    |       |   |   |   numerictypes.pyi
    |       |   |   |   overrides.py
    |       |   |   |   overrides.pyi
    |       |   |   |   printoptions.py
    |       |   |   |   printoptions.pyi
    |       |   |   |   records.py
    |       |   |   |   records.pyi
    |       |   |   |   shape_base.py
    |       |   |   |   shape_base.pyi
    |       |   |   |   strings.py
    |       |   |   |   strings.pyi
    |       |   |   |   umath.py
    |       |   |   |   umath.pyi
    |       |   |   |   _add_newdocs.py
    |       |   |   |   _add_newdocs.pyi
    |       |   |   |   _add_newdocs_scalars.py
    |       |   |   |   _add_newdocs_scalars.pyi
    |       |   |   |   _asarray.py
    |       |   |   |   _asarray.pyi
    |       |   |   |   _dtype.py
    |       |   |   |   _dtype.pyi
    |       |   |   |   _dtype_ctypes.py
    |       |   |   |   _dtype_ctypes.pyi
    |       |   |   |   _exceptions.py
    |       |   |   |   _exceptions.pyi
    |       |   |   |   _internal.py
    |       |   |   |   _internal.pyi
    |       |   |   |   _methods.py
    |       |   |   |   _methods.pyi
    |       |   |   |   _multiarray_tests.cp312-win_amd64.lib
    |       |   |   |   _multiarray_tests.cp312-win_amd64.pyd
    |       |   |   |   _multiarray_umath.cp312-win_amd64.lib
    |       |   |   |   _multiarray_umath.cp312-win_amd64.pyd
    |       |   |   |   _operand_flag_tests.cp312-win_amd64.lib
    |       |   |   |   _operand_flag_tests.cp312-win_amd64.pyd
    |       |   |   |   _rational_tests.cp312-win_amd64.lib
    |       |   |   |   _rational_tests.cp312-win_amd64.pyd
    |       |   |   |   _simd.cp312-win_amd64.lib
    |       |   |   |   _simd.cp312-win_amd64.pyd
    |       |   |   |   _simd.pyi
    |       |   |   |   _string_helpers.py
    |       |   |   |   _string_helpers.pyi
    |       |   |   |   _struct_ufunc_tests.cp312-win_amd64.lib
    |       |   |   |   _struct_ufunc_tests.cp312-win_amd64.pyd
    |       |   |   |   _type_aliases.py
    |       |   |   |   _type_aliases.pyi
    |       |   |   |   _ufunc_config.py
    |       |   |   |   _ufunc_config.pyi
    |       |   |   |   _umath_tests.cp312-win_amd64.lib
    |       |   |   |   _umath_tests.cp312-win_amd64.pyd
    |       |   |   |   _umath_tests.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---include
    |       |   |   |   \---numpy
    |       |   |   |       |   arrayobject.h
    |       |   |   |       |   arrayscalars.h
    |       |   |   |       |   dtype_api.h
    |       |   |   |       |   halffloat.h
    |       |   |   |       |   ndarrayobject.h
    |       |   |   |       |   ndarraytypes.h
    |       |   |   |       |   npy_2_compat.h
    |       |   |   |       |   npy_2_complexcompat.h
    |       |   |   |       |   npy_3kcompat.h
    |       |   |   |       |   npy_common.h
    |       |   |   |       |   npy_cpu.h
    |       |   |   |       |   npy_endian.h
    |       |   |   |       |   npy_math.h
    |       |   |   |       |   npy_no_deprecated_api.h
    |       |   |   |       |   npy_os.h
    |       |   |   |       |   numpyconfig.h
    |       |   |   |       |   ufuncobject.h
    |       |   |   |       |   utils.h
    |       |   |   |       |   _neighborhood_iterator_imp.h
    |       |   |   |       |   _numpyconfig.h
    |       |   |   |       |   _public_dtype_api_table.h
    |       |   |   |       |   __multiarray_api.c
    |       |   |   |       |   __multiarray_api.h
    |       |   |   |       |   __ufunc_api.c
    |       |   |   |       |   __ufunc_api.h
    |       |   |   |       |   
    |       |   |   |       \---random
    |       |   |   |               bitgen.h
    |       |   |   |               distributions.h
    |       |   |   |               libdivide.h
    |       |   |   |               LICENSE.txt
    |       |   |   |               
    |       |   |   +---lib
    |       |   |   |   |   npymath.lib
    |       |   |   |   |   
    |       |   |   |   +---npy-pkg-config
    |       |   |   |   |       mlib.ini
    |       |   |   |   |       npymath.ini
    |       |   |   |   |       
    |       |   |   |   \---pkgconfig
    |       |   |   |           numpy.pc
    |       |   |   |           
    |       |   |   +---tests
    |       |   |   |   |   test_abc.py
    |       |   |   |   |   test_api.py
    |       |   |   |   |   test_argparse.py
    |       |   |   |   |   test_arraymethod.py
    |       |   |   |   |   test_arrayobject.py
    |       |   |   |   |   test_arrayprint.py
    |       |   |   |   |   test_array_api_info.py
    |       |   |   |   |   test_array_coercion.py
    |       |   |   |   |   test_array_interface.py
    |       |   |   |   |   test_casting_floatingpoint_errors.py
    |       |   |   |   |   test_casting_unittests.py
    |       |   |   |   |   test_conversion_utils.py
    |       |   |   |   |   test_cpu_dispatcher.py
    |       |   |   |   |   test_cpu_features.py
    |       |   |   |   |   test_custom_dtypes.py
    |       |   |   |   |   test_cython.py
    |       |   |   |   |   test_datetime.py
    |       |   |   |   |   test_defchararray.py
    |       |   |   |   |   test_deprecations.py
    |       |   |   |   |   test_dlpack.py
    |       |   |   |   |   test_dtype.py
    |       |   |   |   |   test_einsum.py
    |       |   |   |   |   test_errstate.py
    |       |   |   |   |   test_extint128.py
    |       |   |   |   |   test_finfo.py
    |       |   |   |   |   test_function_base.py
    |       |   |   |   |   test_getlimits.py
    |       |   |   |   |   test_half.py
    |       |   |   |   |   test_hashtable.py
    |       |   |   |   |   test_indexerrors.py
    |       |   |   |   |   test_indexing.py
    |       |   |   |   |   test_item_selection.py
    |       |   |   |   |   test_limited_api.py
    |       |   |   |   |   test_longdouble.py
    |       |   |   |   |   test_memmap.py
    |       |   |   |   |   test_mem_overlap.py
    |       |   |   |   |   test_mem_policy.py
    |       |   |   |   |   test_multiarray.py
    |       |   |   |   |   test_multiprocessing.py
    |       |   |   |   |   test_multithreading.py
    |       |   |   |   |   test_nditer.py
    |       |   |   |   |   test_nep50_promotions.py
    |       |   |   |   |   test_numeric.py
    |       |   |   |   |   test_numerictypes.py
    |       |   |   |   |   test_overrides.py
    |       |   |   |   |   test_print.py
    |       |   |   |   |   test_protocols.py
    |       |   |   |   |   test_records.py
    |       |   |   |   |   test_regression.py
    |       |   |   |   |   test_scalarbuffer.py
    |       |   |   |   |   test_scalarinherit.py
    |       |   |   |   |   test_scalarmath.py
    |       |   |   |   |   test_scalarprint.py
    |       |   |   |   |   test_scalar_ctors.py
    |       |   |   |   |   test_scalar_methods.py
    |       |   |   |   |   test_shape_base.py
    |       |   |   |   |   test_simd.py
    |       |   |   |   |   test_simd_module.py
    |       |   |   |   |   test_stringdtype.py
    |       |   |   |   |   test_strings.py
    |       |   |   |   |   test_ufunc.py
    |       |   |   |   |   test_umath.py
    |       |   |   |   |   test_umath_accuracy.py
    |       |   |   |   |   test_umath_complex.py
    |       |   |   |   |   test_unicode.py
    |       |   |   |   |   test__exceptions.py
    |       |   |   |   |   _locales.py
    |       |   |   |   |   _natype.py
    |       |   |   |   |   
    |       |   |   |   +---data
    |       |   |   |   |       astype_copy.pkl
    |       |   |   |   |       generate_umath_validation_data.cpp
    |       |   |   |   |       recarray_from_file.fits
    |       |   |   |   |       umath-validation-set-arccos.csv
    |       |   |   |   |       umath-validation-set-arccosh.csv
    |       |   |   |   |       umath-validation-set-arcsin.csv
    |       |   |   |   |       umath-validation-set-arcsinh.csv
    |       |   |   |   |       umath-validation-set-arctan.csv
    |       |   |   |   |       umath-validation-set-arctanh.csv
    |       |   |   |   |       umath-validation-set-cbrt.csv
    |       |   |   |   |       umath-validation-set-cos.csv
    |       |   |   |   |       umath-validation-set-cosh.csv
    |       |   |   |   |       umath-validation-set-exp.csv
    |       |   |   |   |       umath-validation-set-exp2.csv
    |       |   |   |   |       umath-validation-set-expm1.csv
    |       |   |   |   |       umath-validation-set-log.csv
    |       |   |   |   |       umath-validation-set-log10.csv
    |       |   |   |   |       umath-validation-set-log1p.csv
    |       |   |   |   |       umath-validation-set-log2.csv
    |       |   |   |   |       umath-validation-set-README.txt
    |       |   |   |   |       umath-validation-set-sin.csv
    |       |   |   |   |       umath-validation-set-sinh.csv
    |       |   |   |   |       umath-validation-set-tan.csv
    |       |   |   |   |       umath-validation-set-tanh.csv
    |       |   |   |   |       
    |       |   |   |   +---examples
    |       |   |   |   |   +---cython
    |       |   |   |   |   |   |   checks.pyx
    |       |   |   |   |   |   |   meson.build
    |       |   |   |   |   |   |   setup.py
    |       |   |   |   |   |   |   
    |       |   |   |   |   |           setup.cpython-312.pyc
    |       |   |   |   |   |           
    |       |   |   |   |   \---limited_api
    |       |   |   |   |       |   limited_api1.c
    |       |   |   |   |       |   limited_api2.pyx
    |       |   |   |   |       |   limited_api_latest.c
    |       |   |   |   |       |   meson.build
    |       |   |   |   |       |   setup.py
    |       |   |   |   |       |   
    |       |   |   |   |               setup.cpython-312.pyc
    |       |   |   |   |               
    |       |   |   |           test_abc.cpython-312.pyc
    |       |   |   |           test_api.cpython-312.pyc
    |       |   |   |           test_argparse.cpython-312.pyc
    |       |   |   |           test_arraymethod.cpython-312.pyc
    |       |   |   |           test_arrayobject.cpython-312.pyc
    |       |   |   |           test_arrayprint.cpython-312.pyc
    |       |   |   |           test_array_api_info.cpython-312.pyc
    |       |   |   |           test_array_coercion.cpython-312.pyc
    |       |   |   |           test_array_interface.cpython-312.pyc
    |       |   |   |           test_casting_floatingpoint_errors.cpython-312.pyc
    |       |   |   |           test_casting_unittests.cpython-312.pyc
    |       |   |   |           test_conversion_utils.cpython-312.pyc
    |       |   |   |           test_cpu_dispatcher.cpython-312.pyc
    |       |   |   |           test_cpu_features.cpython-312.pyc
    |       |   |   |           test_custom_dtypes.cpython-312.pyc
    |       |   |   |           test_cython.cpython-312.pyc
    |       |   |   |           test_datetime.cpython-312.pyc
    |       |   |   |           test_defchararray.cpython-312.pyc
    |       |   |   |           test_deprecations.cpython-312.pyc
    |       |   |   |           test_dlpack.cpython-312.pyc
    |       |   |   |           test_dtype.cpython-312.pyc
    |       |   |   |           test_einsum.cpython-312.pyc
    |       |   |   |           test_errstate.cpython-312.pyc
    |       |   |   |           test_extint128.cpython-312.pyc
    |       |   |   |           test_finfo.cpython-312.pyc
    |       |   |   |           test_function_base.cpython-312.pyc
    |       |   |   |           test_getlimits.cpython-312.pyc
    |       |   |   |           test_half.cpython-312.pyc
    |       |   |   |           test_hashtable.cpython-312.pyc
    |       |   |   |           test_indexerrors.cpython-312.pyc
    |       |   |   |           test_indexing.cpython-312.pyc
    |       |   |   |           test_item_selection.cpython-312.pyc
    |       |   |   |           test_limited_api.cpython-312.pyc
    |       |   |   |           test_longdouble.cpython-312.pyc
    |       |   |   |           test_memmap.cpython-312.pyc
    |       |   |   |           test_mem_overlap.cpython-312.pyc
    |       |   |   |           test_mem_policy.cpython-312.pyc
    |       |   |   |           test_multiarray.cpython-312.pyc
    |       |   |   |           test_multiprocessing.cpython-312.pyc
    |       |   |   |           test_multithreading.cpython-312.pyc
    |       |   |   |           test_nditer.cpython-312.pyc
    |       |   |   |           test_nep50_promotions.cpython-312.pyc
    |       |   |   |           test_numeric.cpython-312.pyc
    |       |   |   |           test_numerictypes.cpython-312.pyc
    |       |   |   |           test_overrides.cpython-312.pyc
    |       |   |   |           test_print.cpython-312.pyc
    |       |   |   |           test_protocols.cpython-312.pyc
    |       |   |   |           test_records.cpython-312.pyc
    |       |   |   |           test_regression.cpython-312.pyc
    |       |   |   |           test_scalarbuffer.cpython-312.pyc
    |       |   |   |           test_scalarinherit.cpython-312.pyc
    |       |   |   |           test_scalarmath.cpython-312.pyc
    |       |   |   |           test_scalarprint.cpython-312.pyc
    |       |   |   |           test_scalar_ctors.cpython-312.pyc
    |       |   |   |           test_scalar_methods.cpython-312.pyc
    |       |   |   |           test_shape_base.cpython-312.pyc
    |       |   |   |           test_simd.cpython-312.pyc
    |       |   |   |           test_simd_module.cpython-312.pyc
    |       |   |   |           test_stringdtype.cpython-312.pyc
    |       |   |   |           test_strings.cpython-312.pyc
    |       |   |   |           test_ufunc.cpython-312.pyc
    |       |   |   |           test_umath.cpython-312.pyc
    |       |   |   |           test_umath_accuracy.cpython-312.pyc
    |       |   |   |           test_umath_complex.cpython-312.pyc
    |       |   |   |           test_unicode.cpython-312.pyc
    |       |   |   |           test__exceptions.cpython-312.pyc
    |       |   |   |           _locales.cpython-312.pyc
    |       |   |   |           _natype.cpython-312.pyc
    |       |   |   |           
    |       |   |           arrayprint.cpython-312.pyc
    |       |   |           cversions.cpython-312.pyc
    |       |   |           defchararray.cpython-312.pyc
    |       |   |           einsumfunc.cpython-312.pyc
    |       |   |           fromnumeric.cpython-312.pyc
    |       |   |           function_base.cpython-312.pyc
    |       |   |           getlimits.cpython-312.pyc
    |       |   |           memmap.cpython-312.pyc
    |       |   |           multiarray.cpython-312.pyc
    |       |   |           numeric.cpython-312.pyc
    |       |   |           numerictypes.cpython-312.pyc
    |       |   |           overrides.cpython-312.pyc
    |       |   |           printoptions.cpython-312.pyc
    |       |   |           records.cpython-312.pyc
    |       |   |           shape_base.cpython-312.pyc
    |       |   |           strings.cpython-312.pyc
    |       |   |           umath.cpython-312.pyc
    |       |   |           _add_newdocs.cpython-312.pyc
    |       |   |           _add_newdocs_scalars.cpython-312.pyc
    |       |   |           _asarray.cpython-312.pyc
    |       |   |           _dtype.cpython-312.pyc
    |       |   |           _dtype_ctypes.cpython-312.pyc
    |       |   |           _exceptions.cpython-312.pyc
    |       |   |           _internal.cpython-312.pyc
    |       |   |           _methods.cpython-312.pyc
    |       |   |           _string_helpers.cpython-312.pyc
    |       |   |           _type_aliases.cpython-312.pyc
    |       |   |           _ufunc_config.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_pyinstaller
    |       |   |   |   hook-numpy.py
    |       |   |   |   hook-numpy.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |   +---tests
    |       |   |   |   |   pyinstaller-smoke.py
    |       |   |   |   |   test_pyinstaller.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           pyinstaller-smoke.cpython-312.pyc
    |       |   |   |           test_pyinstaller.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           hook-numpy.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_typing
    |       |   |   |   _add_docstring.py
    |       |   |   |   _array_like.py
    |       |   |   |   _char_codes.py
    |       |   |   |   _dtype_like.py
    |       |   |   |   _extended_precision.py
    |       |   |   |   _nbit.py
    |       |   |   |   _nbit_base.py
    |       |   |   |   _nbit_base.pyi
    |       |   |   |   _nested_sequence.py
    |       |   |   |   _scalars.py
    |       |   |   |   _shape.py
    |       |   |   |   _ufunc.py
    |       |   |   |   _ufunc.pyi
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _add_docstring.cpython-312.pyc
    |       |   |           _array_like.cpython-312.pyc
    |       |   |           _char_codes.cpython-312.pyc
    |       |   |           _dtype_like.cpython-312.pyc
    |       |   |           _extended_precision.cpython-312.pyc
    |       |   |           _nbit.cpython-312.pyc
    |       |   |           _nbit_base.cpython-312.pyc
    |       |   |           _nested_sequence.cpython-312.pyc
    |       |   |           _scalars.cpython-312.pyc
    |       |   |           _shape.cpython-312.pyc
    |       |   |           _ufunc.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_utils
    |       |   |   |   _convertions.py
    |       |   |   |   _convertions.pyi
    |       |   |   |   _inspect.py
    |       |   |   |   _inspect.pyi
    |       |   |   |   _pep440.py
    |       |   |   |   _pep440.pyi
    |       |   |   |   __init__.py
    |       |   |   |   __init__.pyi
    |       |   |   |   
    |       |   |           _convertions.cpython-312.pyc
    |       |   |           _inspect.cpython-312.pyc
    |       |   |           _pep440.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           conftest.cpython-312.pyc
    |       |           dtypes.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           matlib.cpython-312.pyc
    |       |           version.cpython-312.pyc
    |       |           _array_api_info.cpython-312.pyc
    |       |           _configtool.cpython-312.pyc
    |       |           _distributor_init.cpython-312.pyc
    |       |           _expired_attrs_2_0.cpython-312.pyc
    |       |           _globals.cpython-312.pyc
    |       |           _pytesttester.cpython-312.pyc
    |       |           __config__.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---numpy-2.4.2.dist-info
    |       |   |   DELVEWHEEL
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |       |   LICENSE.txt
    |       |       |   
    |       |       \---numpy
    |       |           +---fft
    |       |           |   \---pocketfft
    |       |           |           LICENSE.md
    |       |           |           
    |       |           +---linalg
    |       |           |   \---lapack_lite
    |       |           |           LICENSE.txt
    |       |           |           
    |       |           +---ma
    |       |           |       LICENSE
    |       |           |       
    |       |           +---random
    |       |           |   |   LICENSE.md
    |       |           |   |   
    |       |           |   \---src
    |       |           |       +---distributions
    |       |           |       |       LICENSE.md
    |       |           |       |       
    |       |           |       +---mt19937
    |       |           |       |       LICENSE.md
    |       |           |       |       
    |       |           |       +---pcg64
    |       |           |       |       LICENSE.md
    |       |           |       |       
    |       |           |       +---philox
    |       |           |       |       LICENSE.md
    |       |           |       |       
    |       |           |       +---sfc64
    |       |           |       |       LICENSE.md
    |       |           |       |       
    |       |           |       \---splitmix64
    |       |           |               LICENSE.md
    |       |           |               
    |       |           \---_core
    |       |               +---include
    |       |               |   \---numpy
    |       |               |       \---libdivide
    |       |               |               LICENSE.txt
    |       |               |               
    |       |               \---src
    |       |                   +---common
    |       |                   |   \---pythoncapi-compat
    |       |                   |           COPYING
    |       |                   |           
    |       |                   +---highway
    |       |                   |       LICENSE
    |       |                   |       
    |       |                   +---multiarray
    |       |                   |       dragon4_LICENSE.txt
    |       |                   |       
    |       |                   +---npysort
    |       |                   |   \---x86-simd-sort
    |       |                   |           LICENSE.md
    |       |                   |           
    |       |                   \---umath
    |       |                       \---svml
    |       |                               LICENSE
    |       |                               
    |       +---numpy.libs
    |       |       libscipy_openblas64_-74a408729250596b0973e69fdd954eea.dll
    |       |       msvcp140-a4c2229bdc2a2a630acdc095b4d86008.dll
    |       |       
    |       +---passlib
    |       |   |   apache.py
    |       |   |   apps.py
    |       |   |   context.py
    |       |   |   exc.py
    |       |   |   hash.py
    |       |   |   hosts.py
    |       |   |   ifc.py
    |       |   |   pwd.py
    |       |   |   registry.py
    |       |   |   totp.py
    |       |   |   win32.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---crypto
    |       |   |   |   des.py
    |       |   |   |   digest.py
    |       |   |   |   _md4.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---scrypt
    |       |   |   |   |   _builtin.py
    |       |   |   |   |   _gen_files.py
    |       |   |   |   |   _salsa.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           _builtin.cpython-312.pyc
    |       |   |   |           _gen_files.cpython-312.pyc
    |       |   |   |           _salsa.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---_blowfish
    |       |   |   |   |   base.py
    |       |   |   |   |   unrolled.py
    |       |   |   |   |   _gen_files.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           unrolled.cpython-312.pyc
    |       |   |   |           _gen_files.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           des.cpython-312.pyc
    |       |   |           digest.cpython-312.pyc
    |       |   |           _md4.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---ext
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---django
    |       |   |   |   |   models.py
    |       |   |   |   |   utils.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           models.cpython-312.pyc
    |       |   |   |           utils.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---handlers
    |       |   |   |   argon2.py
    |       |   |   |   bcrypt.py
    |       |   |   |   cisco.py
    |       |   |   |   des_crypt.py
    |       |   |   |   digests.py
    |       |   |   |   django.py
    |       |   |   |   fshp.py
    |       |   |   |   ldap_digests.py
    |       |   |   |   md5_crypt.py
    |       |   |   |   misc.py
    |       |   |   |   mssql.py
    |       |   |   |   mysql.py
    |       |   |   |   oracle.py
    |       |   |   |   pbkdf2.py
    |       |   |   |   phpass.py
    |       |   |   |   postgres.py
    |       |   |   |   roundup.py
    |       |   |   |   scram.py
    |       |   |   |   scrypt.py
    |       |   |   |   sha1_crypt.py
    |       |   |   |   sha2_crypt.py
    |       |   |   |   sun_md5_crypt.py
    |       |   |   |   windows.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           argon2.cpython-312.pyc
    |       |   |           bcrypt.cpython-312.pyc
    |       |   |           cisco.cpython-312.pyc
    |       |   |           des_crypt.cpython-312.pyc
    |       |   |           digests.cpython-312.pyc
    |       |   |           django.cpython-312.pyc
    |       |   |           fshp.cpython-312.pyc
    |       |   |           ldap_digests.cpython-312.pyc
    |       |   |           md5_crypt.cpython-312.pyc
    |       |   |           misc.cpython-312.pyc
    |       |   |           mssql.cpython-312.pyc
    |       |   |           mysql.cpython-312.pyc
    |       |   |           oracle.cpython-312.pyc
    |       |   |           pbkdf2.cpython-312.pyc
    |       |   |           phpass.cpython-312.pyc
    |       |   |           postgres.cpython-312.pyc
    |       |   |           roundup.cpython-312.pyc
    |       |   |           scram.cpython-312.pyc
    |       |   |           scrypt.cpython-312.pyc
    |       |   |           sha1_crypt.cpython-312.pyc
    |       |   |           sha2_crypt.cpython-312.pyc
    |       |   |           sun_md5_crypt.cpython-312.pyc
    |       |   |           windows.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---tests
    |       |   |   |   backports.py
    |       |   |   |   sample1.cfg
    |       |   |   |   sample1b.cfg
    |       |   |   |   sample1c.cfg
    |       |   |   |   sample_config_1s.cfg
    |       |   |   |   test_apache.py
    |       |   |   |   test_apps.py
    |       |   |   |   test_context.py
    |       |   |   |   test_context_deprecated.py
    |       |   |   |   test_crypto_builtin_md4.py
    |       |   |   |   test_crypto_des.py
    |       |   |   |   test_crypto_digest.py
    |       |   |   |   test_crypto_scrypt.py
    |       |   |   |   test_ext_django.py
    |       |   |   |   test_ext_django_source.py
    |       |   |   |   test_handlers.py
    |       |   |   |   test_handlers_argon2.py
    |       |   |   |   test_handlers_bcrypt.py
    |       |   |   |   test_handlers_cisco.py
    |       |   |   |   test_handlers_django.py
    |       |   |   |   test_handlers_pbkdf2.py
    |       |   |   |   test_handlers_scrypt.py
    |       |   |   |   test_hosts.py
    |       |   |   |   test_pwd.py
    |       |   |   |   test_registry.py
    |       |   |   |   test_totp.py
    |       |   |   |   test_utils.py
    |       |   |   |   test_utils_handlers.py
    |       |   |   |   test_utils_md4.py
    |       |   |   |   test_utils_pbkdf2.py
    |       |   |   |   test_win32.py
    |       |   |   |   tox_support.py
    |       |   |   |   utils.py
    |       |   |   |   _test_bad_register.py
    |       |   |   |   __init__.py
    |       |   |   |   __main__.py
    |       |   |   |   
    |       |   |           backports.cpython-312.pyc
    |       |   |           test_apache.cpython-312.pyc
    |       |   |           test_apps.cpython-312.pyc
    |       |   |           test_context.cpython-312.pyc
    |       |   |           test_context_deprecated.cpython-312.pyc
    |       |   |           test_crypto_builtin_md4.cpython-312.pyc
    |       |   |           test_crypto_des.cpython-312.pyc
    |       |   |           test_crypto_digest.cpython-312.pyc
    |       |   |           test_crypto_scrypt.cpython-312.pyc
    |       |   |           test_ext_django.cpython-312.pyc
    |       |   |           test_ext_django_source.cpython-312.pyc
    |       |   |           test_handlers.cpython-312.pyc
    |       |   |           test_handlers_argon2.cpython-312.pyc
    |       |   |           test_handlers_bcrypt.cpython-312.pyc
    |       |   |           test_handlers_cisco.cpython-312.pyc
    |       |   |           test_handlers_django.cpython-312.pyc
    |       |   |           test_handlers_pbkdf2.cpython-312.pyc
    |       |   |           test_handlers_scrypt.cpython-312.pyc
    |       |   |           test_hosts.cpython-312.pyc
    |       |   |           test_pwd.cpython-312.pyc
    |       |   |           test_registry.cpython-312.pyc
    |       |   |           test_totp.cpython-312.pyc
    |       |   |           test_utils.cpython-312.pyc
    |       |   |           test_utils_handlers.cpython-312.pyc
    |       |   |           test_utils_md4.cpython-312.pyc
    |       |   |           test_utils_pbkdf2.cpython-312.pyc
    |       |   |           test_win32.cpython-312.pyc
    |       |   |           tox_support.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           _test_bad_register.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           __main__.cpython-312.pyc
    |       |   |           
    |       |   +---utils
    |       |   |   |   binary.py
    |       |   |   |   decor.py
    |       |   |   |   des.py
    |       |   |   |   handlers.py
    |       |   |   |   md4.py
    |       |   |   |   pbkdf2.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---compat
    |       |   |   |   |   _ordered_dict.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           _ordered_dict.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           binary.cpython-312.pyc
    |       |   |           decor.cpython-312.pyc
    |       |   |           des.cpython-312.pyc
    |       |   |           handlers.cpython-312.pyc
    |       |   |           md4.cpython-312.pyc
    |       |   |           pbkdf2.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_data
    |       |   |   \---wordsets
    |       |   |           bip39.txt
    |       |   |           eff_long.txt
    |       |   |           eff_prefixed.txt
    |       |   |           eff_short.txt
    |       |   |           
    |       |           apache.cpython-312.pyc
    |       |           apps.cpython-312.pyc
    |       |           context.cpython-312.pyc
    |       |           exc.cpython-312.pyc
    |       |           hash.cpython-312.pyc
    |       |           hosts.cpython-312.pyc
    |       |           ifc.cpython-312.pyc
    |       |           pwd.cpython-312.pyc
    |       |           registry.cpython-312.pyc
    |       |           totp.cpython-312.pyc
    |       |           win32.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---passlib-1.7.4.dist-info
    |       |       INSTALLER
    |       |       LICENSE
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       top_level.txt
    |       |       WHEEL
    |       |       zip-safe
    |       |       
    |       +---pgvector
    |       |   |   bit.py
    |       |   |   halfvec.py
    |       |   |   sparsevec.py
    |       |   |   vector.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---asyncpg
    |       |   |   |   register.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           register.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---django
    |       |   |   |   bit.py
    |       |   |   |   extensions.py
    |       |   |   |   functions.py
    |       |   |   |   halfvec.py
    |       |   |   |   indexes.py
    |       |   |   |   sparsevec.py
    |       |   |   |   vector.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           bit.cpython-312.pyc
    |       |   |           extensions.cpython-312.pyc
    |       |   |           functions.cpython-312.pyc
    |       |   |           halfvec.cpython-312.pyc
    |       |   |           indexes.cpython-312.pyc
    |       |   |           sparsevec.cpython-312.pyc
    |       |   |           vector.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---peewee
    |       |   |   |   bit.py
    |       |   |   |   halfvec.py
    |       |   |   |   sparsevec.py
    |       |   |   |   vector.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           bit.cpython-312.pyc
    |       |   |           halfvec.cpython-312.pyc
    |       |   |           sparsevec.cpython-312.pyc
    |       |   |           vector.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---pg8000
    |       |   |   |   register.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           register.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---psycopg
    |       |   |   |   bit.py
    |       |   |   |   halfvec.py
    |       |   |   |   register.py
    |       |   |   |   sparsevec.py
    |       |   |   |   vector.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           bit.cpython-312.pyc
    |       |   |           halfvec.cpython-312.pyc
    |       |   |           register.cpython-312.pyc
    |       |   |           sparsevec.cpython-312.pyc
    |       |   |           vector.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---psycopg2
    |       |   |   |   halfvec.py
    |       |   |   |   register.py
    |       |   |   |   sparsevec.py
    |       |   |   |   vector.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           halfvec.cpython-312.pyc
    |       |   |           register.cpython-312.pyc
    |       |   |           sparsevec.cpython-312.pyc
    |       |   |           vector.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---sqlalchemy
    |       |   |   |   bit.py
    |       |   |   |   functions.py
    |       |   |   |   halfvec.py
    |       |   |   |   sparsevec.py
    |       |   |   |   vector.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           bit.cpython-312.pyc
    |       |   |           functions.cpython-312.pyc
    |       |   |           halfvec.cpython-312.pyc
    |       |   |           sparsevec.cpython-312.pyc
    |       |   |           vector.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---utils
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           bit.cpython-312.pyc
    |       |           halfvec.cpython-312.pyc
    |       |           sparsevec.cpython-312.pyc
    |       |           vector.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---pgvector-0.4.2.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.txt
    |       |           
    |       +---pip
    |       |   |   py.typed
    |       |   |   __init__.py
    |       |   |   __main__.py
    |       |   |   __pip-runner__.py
    |       |   |   
    |       |   +---_internal
    |       |   |   |   build_env.py
    |       |   |   |   cache.py
    |       |   |   |   configuration.py
    |       |   |   |   exceptions.py
    |       |   |   |   main.py
    |       |   |   |   pyproject.py
    |       |   |   |   self_outdated_check.py
    |       |   |   |   wheel_builder.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---cli
    |       |   |   |   |   autocompletion.py
    |       |   |   |   |   base_command.py
    |       |   |   |   |   cmdoptions.py
    |       |   |   |   |   command_context.py
    |       |   |   |   |   index_command.py
    |       |   |   |   |   main.py
    |       |   |   |   |   main_parser.py
    |       |   |   |   |   parser.py
    |       |   |   |   |   progress_bars.py
    |       |   |   |   |   req_command.py
    |       |   |   |   |   spinners.py
    |       |   |   |   |   status_codes.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           autocompletion.cpython-312.pyc
    |       |   |   |           base_command.cpython-312.pyc
    |       |   |   |           cmdoptions.cpython-312.pyc
    |       |   |   |           command_context.cpython-312.pyc
    |       |   |   |           index_command.cpython-312.pyc
    |       |   |   |           main.cpython-312.pyc
    |       |   |   |           main_parser.cpython-312.pyc
    |       |   |   |           parser.cpython-312.pyc
    |       |   |   |           progress_bars.cpython-312.pyc
    |       |   |   |           req_command.cpython-312.pyc
    |       |   |   |           spinners.cpython-312.pyc
    |       |   |   |           status_codes.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---commands
    |       |   |   |   |   cache.py
    |       |   |   |   |   check.py
    |       |   |   |   |   completion.py
    |       |   |   |   |   configuration.py
    |       |   |   |   |   debug.py
    |       |   |   |   |   download.py
    |       |   |   |   |   freeze.py
    |       |   |   |   |   hash.py
    |       |   |   |   |   help.py
    |       |   |   |   |   index.py
    |       |   |   |   |   inspect.py
    |       |   |   |   |   install.py
    |       |   |   |   |   list.py
    |       |   |   |   |   search.py
    |       |   |   |   |   show.py
    |       |   |   |   |   uninstall.py
    |       |   |   |   |   wheel.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           cache.cpython-312.pyc
    |       |   |   |           check.cpython-312.pyc
    |       |   |   |           completion.cpython-312.pyc
    |       |   |   |           configuration.cpython-312.pyc
    |       |   |   |           debug.cpython-312.pyc
    |       |   |   |           download.cpython-312.pyc
    |       |   |   |           freeze.cpython-312.pyc
    |       |   |   |           hash.cpython-312.pyc
    |       |   |   |           help.cpython-312.pyc
    |       |   |   |           index.cpython-312.pyc
    |       |   |   |           inspect.cpython-312.pyc
    |       |   |   |           install.cpython-312.pyc
    |       |   |   |           list.cpython-312.pyc
    |       |   |   |           search.cpython-312.pyc
    |       |   |   |           show.cpython-312.pyc
    |       |   |   |           uninstall.cpython-312.pyc
    |       |   |   |           wheel.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---distributions
    |       |   |   |   |   base.py
    |       |   |   |   |   installed.py
    |       |   |   |   |   sdist.py
    |       |   |   |   |   wheel.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           installed.cpython-312.pyc
    |       |   |   |           sdist.cpython-312.pyc
    |       |   |   |           wheel.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---index
    |       |   |   |   |   collector.py
    |       |   |   |   |   package_finder.py
    |       |   |   |   |   sources.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           collector.cpython-312.pyc
    |       |   |   |           package_finder.cpython-312.pyc
    |       |   |   |           sources.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---locations
    |       |   |   |   |   base.py
    |       |   |   |   |   _distutils.py
    |       |   |   |   |   _sysconfig.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           _distutils.cpython-312.pyc
    |       |   |   |           _sysconfig.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---metadata
    |       |   |   |   |   base.py
    |       |   |   |   |   pkg_resources.py
    |       |   |   |   |   _json.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---importlib
    |       |   |   |   |   |   _compat.py
    |       |   |   |   |   |   _dists.py
    |       |   |   |   |   |   _envs.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           _compat.cpython-312.pyc
    |       |   |   |   |           _dists.cpython-312.pyc
    |       |   |   |   |           _envs.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           pkg_resources.cpython-312.pyc
    |       |   |   |           _json.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---models
    |       |   |   |   |   candidate.py
    |       |   |   |   |   direct_url.py
    |       |   |   |   |   format_control.py
    |       |   |   |   |   index.py
    |       |   |   |   |   installation_report.py
    |       |   |   |   |   link.py
    |       |   |   |   |   scheme.py
    |       |   |   |   |   search_scope.py
    |       |   |   |   |   selection_prefs.py
    |       |   |   |   |   target_python.py
    |       |   |   |   |   wheel.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           candidate.cpython-312.pyc
    |       |   |   |           direct_url.cpython-312.pyc
    |       |   |   |           format_control.cpython-312.pyc
    |       |   |   |           index.cpython-312.pyc
    |       |   |   |           installation_report.cpython-312.pyc
    |       |   |   |           link.cpython-312.pyc
    |       |   |   |           scheme.cpython-312.pyc
    |       |   |   |           search_scope.cpython-312.pyc
    |       |   |   |           selection_prefs.cpython-312.pyc
    |       |   |   |           target_python.cpython-312.pyc
    |       |   |   |           wheel.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---network
    |       |   |   |   |   auth.py
    |       |   |   |   |   cache.py
    |       |   |   |   |   download.py
    |       |   |   |   |   lazy_wheel.py
    |       |   |   |   |   session.py
    |       |   |   |   |   utils.py
    |       |   |   |   |   xmlrpc.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           auth.cpython-312.pyc
    |       |   |   |           cache.cpython-312.pyc
    |       |   |   |           download.cpython-312.pyc
    |       |   |   |           lazy_wheel.cpython-312.pyc
    |       |   |   |           session.cpython-312.pyc
    |       |   |   |           utils.cpython-312.pyc
    |       |   |   |           xmlrpc.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---operations
    |       |   |   |   |   check.py
    |       |   |   |   |   freeze.py
    |       |   |   |   |   prepare.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---build
    |       |   |   |   |   |   build_tracker.py
    |       |   |   |   |   |   metadata.py
    |       |   |   |   |   |   metadata_editable.py
    |       |   |   |   |   |   metadata_legacy.py
    |       |   |   |   |   |   wheel.py
    |       |   |   |   |   |   wheel_editable.py
    |       |   |   |   |   |   wheel_legacy.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           build_tracker.cpython-312.pyc
    |       |   |   |   |           metadata.cpython-312.pyc
    |       |   |   |   |           metadata_editable.cpython-312.pyc
    |       |   |   |   |           metadata_legacy.cpython-312.pyc
    |       |   |   |   |           wheel.cpython-312.pyc
    |       |   |   |   |           wheel_editable.cpython-312.pyc
    |       |   |   |   |           wheel_legacy.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---install
    |       |   |   |   |   |   editable_legacy.py
    |       |   |   |   |   |   wheel.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           editable_legacy.cpython-312.pyc
    |       |   |   |   |           wheel.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           check.cpython-312.pyc
    |       |   |   |           freeze.cpython-312.pyc
    |       |   |   |           prepare.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---req
    |       |   |   |   |   constructors.py
    |       |   |   |   |   req_file.py
    |       |   |   |   |   req_install.py
    |       |   |   |   |   req_set.py
    |       |   |   |   |   req_uninstall.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           constructors.cpython-312.pyc
    |       |   |   |           req_file.cpython-312.pyc
    |       |   |   |           req_install.cpython-312.pyc
    |       |   |   |           req_set.cpython-312.pyc
    |       |   |   |           req_uninstall.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---resolution
    |       |   |   |   |   base.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---legacy
    |       |   |   |   |   |   resolver.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           resolver.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---resolvelib
    |       |   |   |   |   |   base.py
    |       |   |   |   |   |   candidates.py
    |       |   |   |   |   |   factory.py
    |       |   |   |   |   |   found_candidates.py
    |       |   |   |   |   |   provider.py
    |       |   |   |   |   |   reporter.py
    |       |   |   |   |   |   requirements.py
    |       |   |   |   |   |   resolver.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           base.cpython-312.pyc
    |       |   |   |   |           candidates.cpython-312.pyc
    |       |   |   |   |           factory.cpython-312.pyc
    |       |   |   |   |           found_candidates.cpython-312.pyc
    |       |   |   |   |           provider.cpython-312.pyc
    |       |   |   |   |           reporter.cpython-312.pyc
    |       |   |   |   |           requirements.cpython-312.pyc
    |       |   |   |   |           resolver.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---utils
    |       |   |   |   |   appdirs.py
    |       |   |   |   |   compat.py
    |       |   |   |   |   compatibility_tags.py
    |       |   |   |   |   datetime.py
    |       |   |   |   |   deprecation.py
    |       |   |   |   |   direct_url_helpers.py
    |       |   |   |   |   egg_link.py
    |       |   |   |   |   encoding.py
    |       |   |   |   |   entrypoints.py
    |       |   |   |   |   filesystem.py
    |       |   |   |   |   filetypes.py
    |       |   |   |   |   glibc.py
    |       |   |   |   |   hashes.py
    |       |   |   |   |   logging.py
    |       |   |   |   |   misc.py
    |       |   |   |   |   packaging.py
    |       |   |   |   |   retry.py
    |       |   |   |   |   setuptools_build.py
    |       |   |   |   |   subprocess.py
    |       |   |   |   |   temp_dir.py
    |       |   |   |   |   unpacking.py
    |       |   |   |   |   urls.py
    |       |   |   |   |   virtualenv.py
    |       |   |   |   |   wheel.py
    |       |   |   |   |   _jaraco_text.py
    |       |   |   |   |   _log.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           appdirs.cpython-312.pyc
    |       |   |   |           compat.cpython-312.pyc
    |       |   |   |           compatibility_tags.cpython-312.pyc
    |       |   |   |           datetime.cpython-312.pyc
    |       |   |   |           deprecation.cpython-312.pyc
    |       |   |   |           direct_url_helpers.cpython-312.pyc
    |       |   |   |           egg_link.cpython-312.pyc
    |       |   |   |           encoding.cpython-312.pyc
    |       |   |   |           entrypoints.cpython-312.pyc
    |       |   |   |           filesystem.cpython-312.pyc
    |       |   |   |           filetypes.cpython-312.pyc
    |       |   |   |           glibc.cpython-312.pyc
    |       |   |   |           hashes.cpython-312.pyc
    |       |   |   |           logging.cpython-312.pyc
    |       |   |   |           misc.cpython-312.pyc
    |       |   |   |           packaging.cpython-312.pyc
    |       |   |   |           retry.cpython-312.pyc
    |       |   |   |           setuptools_build.cpython-312.pyc
    |       |   |   |           subprocess.cpython-312.pyc
    |       |   |   |           temp_dir.cpython-312.pyc
    |       |   |   |           unpacking.cpython-312.pyc
    |       |   |   |           urls.cpython-312.pyc
    |       |   |   |           virtualenv.cpython-312.pyc
    |       |   |   |           wheel.cpython-312.pyc
    |       |   |   |           _jaraco_text.cpython-312.pyc
    |       |   |   |           _log.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---vcs
    |       |   |   |   |   bazaar.py
    |       |   |   |   |   git.py
    |       |   |   |   |   mercurial.py
    |       |   |   |   |   subversion.py
    |       |   |   |   |   versioncontrol.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           bazaar.cpython-312.pyc
    |       |   |   |           git.cpython-312.pyc
    |       |   |   |           mercurial.cpython-312.pyc
    |       |   |   |           subversion.cpython-312.pyc
    |       |   |   |           versioncontrol.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           build_env.cpython-312.pyc
    |       |   |           cache.cpython-312.pyc
    |       |   |           configuration.cpython-312.pyc
    |       |   |           exceptions.cpython-312.pyc
    |       |   |           main.cpython-312.pyc
    |       |   |           pyproject.cpython-312.pyc
    |       |   |           self_outdated_check.cpython-312.pyc
    |       |   |           wheel_builder.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_vendor
    |       |   |   |   typing_extensions.py
    |       |   |   |   vendor.txt
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---cachecontrol
    |       |   |   |   |   adapter.py
    |       |   |   |   |   cache.py
    |       |   |   |   |   controller.py
    |       |   |   |   |   filewrapper.py
    |       |   |   |   |   heuristics.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   serialize.py
    |       |   |   |   |   wrapper.py
    |       |   |   |   |   _cmd.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---caches
    |       |   |   |   |   |   file_cache.py
    |       |   |   |   |   |   redis_cache.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           file_cache.cpython-312.pyc
    |       |   |   |   |           redis_cache.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           adapter.cpython-312.pyc
    |       |   |   |           cache.cpython-312.pyc
    |       |   |   |           controller.cpython-312.pyc
    |       |   |   |           filewrapper.cpython-312.pyc
    |       |   |   |           heuristics.cpython-312.pyc
    |       |   |   |           serialize.cpython-312.pyc
    |       |   |   |           wrapper.cpython-312.pyc
    |       |   |   |           _cmd.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---certifi
    |       |   |   |   |   cacert.pem
    |       |   |   |   |   core.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __main__.py
    |       |   |   |   |   
    |       |   |   |           core.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __main__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---distlib
    |       |   |   |   |   compat.py
    |       |   |   |   |   database.py
    |       |   |   |   |   index.py
    |       |   |   |   |   locators.py
    |       |   |   |   |   manifest.py
    |       |   |   |   |   markers.py
    |       |   |   |   |   metadata.py
    |       |   |   |   |   resources.py
    |       |   |   |   |   scripts.py
    |       |   |   |   |   t32.exe
    |       |   |   |   |   t64-arm.exe
    |       |   |   |   |   t64.exe
    |       |   |   |   |   util.py
    |       |   |   |   |   version.py
    |       |   |   |   |   w32.exe
    |       |   |   |   |   w64-arm.exe
    |       |   |   |   |   w64.exe
    |       |   |   |   |   wheel.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           compat.cpython-312.pyc
    |       |   |   |           database.cpython-312.pyc
    |       |   |   |           index.cpython-312.pyc
    |       |   |   |           locators.cpython-312.pyc
    |       |   |   |           manifest.cpython-312.pyc
    |       |   |   |           markers.cpython-312.pyc
    |       |   |   |           metadata.cpython-312.pyc
    |       |   |   |           resources.cpython-312.pyc
    |       |   |   |           scripts.cpython-312.pyc
    |       |   |   |           util.cpython-312.pyc
    |       |   |   |           version.cpython-312.pyc
    |       |   |   |           wheel.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---distro
    |       |   |   |   |   distro.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __main__.py
    |       |   |   |   |   
    |       |   |   |           distro.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __main__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---idna
    |       |   |   |   |   codec.py
    |       |   |   |   |   compat.py
    |       |   |   |   |   core.py
    |       |   |   |   |   idnadata.py
    |       |   |   |   |   intranges.py
    |       |   |   |   |   package_data.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   uts46data.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           codec.cpython-312.pyc
    |       |   |   |           compat.cpython-312.pyc
    |       |   |   |           core.cpython-312.pyc
    |       |   |   |           idnadata.cpython-312.pyc
    |       |   |   |           intranges.cpython-312.pyc
    |       |   |   |           package_data.cpython-312.pyc
    |       |   |   |           uts46data.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---msgpack
    |       |   |   |   |   exceptions.py
    |       |   |   |   |   ext.py
    |       |   |   |   |   fallback.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           exceptions.cpython-312.pyc
    |       |   |   |           ext.cpython-312.pyc
    |       |   |   |           fallback.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---packaging
    |       |   |   |   |   markers.py
    |       |   |   |   |   metadata.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   requirements.py
    |       |   |   |   |   specifiers.py
    |       |   |   |   |   tags.py
    |       |   |   |   |   utils.py
    |       |   |   |   |   version.py
    |       |   |   |   |   _elffile.py
    |       |   |   |   |   _manylinux.py
    |       |   |   |   |   _musllinux.py
    |       |   |   |   |   _parser.py
    |       |   |   |   |   _structures.py
    |       |   |   |   |   _tokenizer.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           markers.cpython-312.pyc
    |       |   |   |           metadata.cpython-312.pyc
    |       |   |   |           requirements.cpython-312.pyc
    |       |   |   |           specifiers.cpython-312.pyc
    |       |   |   |           tags.cpython-312.pyc
    |       |   |   |           utils.cpython-312.pyc
    |       |   |   |           version.cpython-312.pyc
    |       |   |   |           _elffile.cpython-312.pyc
    |       |   |   |           _manylinux.cpython-312.pyc
    |       |   |   |           _musllinux.cpython-312.pyc
    |       |   |   |           _parser.cpython-312.pyc
    |       |   |   |           _structures.cpython-312.pyc
    |       |   |   |           _tokenizer.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---pkg_resources
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---platformdirs
    |       |   |   |   |   android.py
    |       |   |   |   |   api.py
    |       |   |   |   |   macos.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   unix.py
    |       |   |   |   |   version.py
    |       |   |   |   |   windows.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __main__.py
    |       |   |   |   |   
    |       |   |   |           android.cpython-312.pyc
    |       |   |   |           api.cpython-312.pyc
    |       |   |   |           macos.cpython-312.pyc
    |       |   |   |           unix.cpython-312.pyc
    |       |   |   |           version.cpython-312.pyc
    |       |   |   |           windows.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __main__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---pygments
    |       |   |   |   |   cmdline.py
    |       |   |   |   |   console.py
    |       |   |   |   |   filter.py
    |       |   |   |   |   formatter.py
    |       |   |   |   |   lexer.py
    |       |   |   |   |   modeline.py
    |       |   |   |   |   plugin.py
    |       |   |   |   |   regexopt.py
    |       |   |   |   |   scanner.py
    |       |   |   |   |   sphinxext.py
    |       |   |   |   |   style.py
    |       |   |   |   |   token.py
    |       |   |   |   |   unistring.py
    |       |   |   |   |   util.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __main__.py
    |       |   |   |   |   
    |       |   |   |   +---filters
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---formatters
    |       |   |   |   |   |   bbcode.py
    |       |   |   |   |   |   groff.py
    |       |   |   |   |   |   html.py
    |       |   |   |   |   |   img.py
    |       |   |   |   |   |   irc.py
    |       |   |   |   |   |   latex.py
    |       |   |   |   |   |   other.py
    |       |   |   |   |   |   pangomarkup.py
    |       |   |   |   |   |   rtf.py
    |       |   |   |   |   |   svg.py
    |       |   |   |   |   |   terminal.py
    |       |   |   |   |   |   terminal256.py
    |       |   |   |   |   |   _mapping.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           bbcode.cpython-312.pyc
    |       |   |   |   |           groff.cpython-312.pyc
    |       |   |   |   |           html.cpython-312.pyc
    |       |   |   |   |           img.cpython-312.pyc
    |       |   |   |   |           irc.cpython-312.pyc
    |       |   |   |   |           latex.cpython-312.pyc
    |       |   |   |   |           other.cpython-312.pyc
    |       |   |   |   |           pangomarkup.cpython-312.pyc
    |       |   |   |   |           rtf.cpython-312.pyc
    |       |   |   |   |           svg.cpython-312.pyc
    |       |   |   |   |           terminal.cpython-312.pyc
    |       |   |   |   |           terminal256.cpython-312.pyc
    |       |   |   |   |           _mapping.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---lexers
    |       |   |   |   |   |   python.py
    |       |   |   |   |   |   _mapping.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           python.cpython-312.pyc
    |       |   |   |   |           _mapping.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---styles
    |       |   |   |   |   |   _mapping.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           _mapping.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           cmdline.cpython-312.pyc
    |       |   |   |           console.cpython-312.pyc
    |       |   |   |           filter.cpython-312.pyc
    |       |   |   |           formatter.cpython-312.pyc
    |       |   |   |           lexer.cpython-312.pyc
    |       |   |   |           modeline.cpython-312.pyc
    |       |   |   |           plugin.cpython-312.pyc
    |       |   |   |           regexopt.cpython-312.pyc
    |       |   |   |           scanner.cpython-312.pyc
    |       |   |   |           sphinxext.cpython-312.pyc
    |       |   |   |           style.cpython-312.pyc
    |       |   |   |           token.cpython-312.pyc
    |       |   |   |           unistring.cpython-312.pyc
    |       |   |   |           util.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __main__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---pyproject_hooks
    |       |   |   |   |   _compat.py
    |       |   |   |   |   _impl.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---_in_process
    |       |   |   |   |   |   _in_process.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           _in_process.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           _compat.cpython-312.pyc
    |       |   |   |           _impl.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---requests
    |       |   |   |   |   adapters.py
    |       |   |   |   |   api.py
    |       |   |   |   |   auth.py
    |       |   |   |   |   certs.py
    |       |   |   |   |   compat.py
    |       |   |   |   |   cookies.py
    |       |   |   |   |   exceptions.py
    |       |   |   |   |   help.py
    |       |   |   |   |   hooks.py
    |       |   |   |   |   models.py
    |       |   |   |   |   packages.py
    |       |   |   |   |   sessions.py
    |       |   |   |   |   status_codes.py
    |       |   |   |   |   structures.py
    |       |   |   |   |   utils.py
    |       |   |   |   |   _internal_utils.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __version__.py
    |       |   |   |   |   
    |       |   |   |           adapters.cpython-312.pyc
    |       |   |   |           api.cpython-312.pyc
    |       |   |   |           auth.cpython-312.pyc
    |       |   |   |           certs.cpython-312.pyc
    |       |   |   |           compat.cpython-312.pyc
    |       |   |   |           cookies.cpython-312.pyc
    |       |   |   |           exceptions.cpython-312.pyc
    |       |   |   |           help.cpython-312.pyc
    |       |   |   |           hooks.cpython-312.pyc
    |       |   |   |           models.cpython-312.pyc
    |       |   |   |           packages.cpython-312.pyc
    |       |   |   |           sessions.cpython-312.pyc
    |       |   |   |           status_codes.cpython-312.pyc
    |       |   |   |           structures.cpython-312.pyc
    |       |   |   |           utils.cpython-312.pyc
    |       |   |   |           _internal_utils.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __version__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---resolvelib
    |       |   |   |   |   providers.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   reporters.py
    |       |   |   |   |   resolvers.py
    |       |   |   |   |   structs.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---compat
    |       |   |   |   |   |   collections_abc.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           collections_abc.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           providers.cpython-312.pyc
    |       |   |   |           reporters.cpython-312.pyc
    |       |   |   |           resolvers.cpython-312.pyc
    |       |   |   |           structs.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---rich
    |       |   |   |   |   abc.py
    |       |   |   |   |   align.py
    |       |   |   |   |   ansi.py
    |       |   |   |   |   bar.py
    |       |   |   |   |   box.py
    |       |   |   |   |   cells.py
    |       |   |   |   |   color.py
    |       |   |   |   |   color_triplet.py
    |       |   |   |   |   columns.py
    |       |   |   |   |   console.py
    |       |   |   |   |   constrain.py
    |       |   |   |   |   containers.py
    |       |   |   |   |   control.py
    |       |   |   |   |   default_styles.py
    |       |   |   |   |   diagnose.py
    |       |   |   |   |   emoji.py
    |       |   |   |   |   errors.py
    |       |   |   |   |   filesize.py
    |       |   |   |   |   file_proxy.py
    |       |   |   |   |   highlighter.py
    |       |   |   |   |   json.py
    |       |   |   |   |   jupyter.py
    |       |   |   |   |   layout.py
    |       |   |   |   |   live.py
    |       |   |   |   |   live_render.py
    |       |   |   |   |   logging.py
    |       |   |   |   |   markup.py
    |       |   |   |   |   measure.py
    |       |   |   |   |   padding.py
    |       |   |   |   |   pager.py
    |       |   |   |   |   palette.py
    |       |   |   |   |   panel.py
    |       |   |   |   |   pretty.py
    |       |   |   |   |   progress.py
    |       |   |   |   |   progress_bar.py
    |       |   |   |   |   prompt.py
    |       |   |   |   |   protocol.py
    |       |   |   |   |   py.typed
    |       |   |   |   |   region.py
    |       |   |   |   |   repr.py
    |       |   |   |   |   rule.py
    |       |   |   |   |   scope.py
    |       |   |   |   |   screen.py
    |       |   |   |   |   segment.py
    |       |   |   |   |   spinner.py
    |       |   |   |   |   status.py
    |       |   |   |   |   style.py
    |       |   |   |   |   styled.py
    |       |   |   |   |   syntax.py
    |       |   |   |   |   table.py
    |       |   |   |   |   terminal_theme.py
    |       |   |   |   |   text.py
    |       |   |   |   |   theme.py
    |       |   |   |   |   themes.py
    |       |   |   |   |   traceback.py
    |       |   |   |   |   tree.py
    |       |   |   |   |   _cell_widths.py
    |       |   |   |   |   _emoji_codes.py
    |       |   |   |   |   _emoji_replace.py
    |       |   |   |   |   _export_format.py
    |       |   |   |   |   _extension.py
    |       |   |   |   |   _fileno.py
    |       |   |   |   |   _inspect.py
    |       |   |   |   |   _log_render.py
    |       |   |   |   |   _loop.py
    |       |   |   |   |   _null_file.py
    |       |   |   |   |   _palettes.py
    |       |   |   |   |   _pick.py
    |       |   |   |   |   _ratio.py
    |       |   |   |   |   _spinners.py
    |       |   |   |   |   _stack.py
    |       |   |   |   |   _timer.py
    |       |   |   |   |   _win32_console.py
    |       |   |   |   |   _windows.py
    |       |   |   |   |   _windows_renderer.py
    |       |   |   |   |   _wrap.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   __main__.py
    |       |   |   |   |   
    |       |   |   |           abc.cpython-312.pyc
    |       |   |   |           align.cpython-312.pyc
    |       |   |   |           ansi.cpython-312.pyc
    |       |   |   |           bar.cpython-312.pyc
    |       |   |   |           box.cpython-312.pyc
    |       |   |   |           cells.cpython-312.pyc
    |       |   |   |           color.cpython-312.pyc
    |       |   |   |           color_triplet.cpython-312.pyc
    |       |   |   |           columns.cpython-312.pyc
    |       |   |   |           console.cpython-312.pyc
    |       |   |   |           constrain.cpython-312.pyc
    |       |   |   |           containers.cpython-312.pyc
    |       |   |   |           control.cpython-312.pyc
    |       |   |   |           default_styles.cpython-312.pyc
    |       |   |   |           diagnose.cpython-312.pyc
    |       |   |   |           emoji.cpython-312.pyc
    |       |   |   |           errors.cpython-312.pyc
    |       |   |   |           filesize.cpython-312.pyc
    |       |   |   |           file_proxy.cpython-312.pyc
    |       |   |   |           highlighter.cpython-312.pyc
    |       |   |   |           json.cpython-312.pyc
    |       |   |   |           jupyter.cpython-312.pyc
    |       |   |   |           layout.cpython-312.pyc
    |       |   |   |           live.cpython-312.pyc
    |       |   |   |           live_render.cpython-312.pyc
    |       |   |   |           logging.cpython-312.pyc
    |       |   |   |           markup.cpython-312.pyc
    |       |   |   |           measure.cpython-312.pyc
    |       |   |   |           padding.cpython-312.pyc
    |       |   |   |           pager.cpython-312.pyc
    |       |   |   |           palette.cpython-312.pyc
    |       |   |   |           panel.cpython-312.pyc
    |       |   |   |           pretty.cpython-312.pyc
    |       |   |   |           progress.cpython-312.pyc
    |       |   |   |           progress_bar.cpython-312.pyc
    |       |   |   |           prompt.cpython-312.pyc
    |       |   |   |           protocol.cpython-312.pyc
    |       |   |   |           region.cpython-312.pyc
    |       |   |   |           repr.cpython-312.pyc
    |       |   |   |           rule.cpython-312.pyc
    |       |   |   |           scope.cpython-312.pyc
    |       |   |   |           screen.cpython-312.pyc
    |       |   |   |           segment.cpython-312.pyc
    |       |   |   |           spinner.cpython-312.pyc
    |       |   |   |           status.cpython-312.pyc
    |       |   |   |           style.cpython-312.pyc
    |       |   |   |           styled.cpython-312.pyc
    |       |   |   |           syntax.cpython-312.pyc
    |       |   |   |           table.cpython-312.pyc
    |       |   |   |           terminal_theme.cpython-312.pyc
    |       |   |   |           text.cpython-312.pyc
    |       |   |   |           theme.cpython-312.pyc
    |       |   |   |           themes.cpython-312.pyc
    |       |   |   |           traceback.cpython-312.pyc
    |       |   |   |           tree.cpython-312.pyc
    |       |   |   |           _cell_widths.cpython-312.pyc
    |       |   |   |           _emoji_codes.cpython-312.pyc
    |       |   |   |           _emoji_replace.cpython-312.pyc
    |       |   |   |           _export_format.cpython-312.pyc
    |       |   |   |           _extension.cpython-312.pyc
    |       |   |   |           _fileno.cpython-312.pyc
    |       |   |   |           _inspect.cpython-312.pyc
    |       |   |   |           _log_render.cpython-312.pyc
    |       |   |   |           _loop.cpython-312.pyc
    |       |   |   |           _null_file.cpython-312.pyc
    |       |   |   |           _palettes.cpython-312.pyc
    |       |   |   |           _pick.cpython-312.pyc
    |       |   |   |           _ratio.cpython-312.pyc
    |       |   |   |           _spinners.cpython-312.pyc
    |       |   |   |           _stack.cpython-312.pyc
    |       |   |   |           _timer.cpython-312.pyc
    |       |   |   |           _win32_console.cpython-312.pyc
    |       |   |   |           _windows.cpython-312.pyc
    |       |   |   |           _windows_renderer.cpython-312.pyc
    |       |   |   |           _wrap.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           __main__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---tomli
    |       |   |   |   |   py.typed
    |       |   |   |   |   _parser.py
    |       |   |   |   |   _re.py
    |       |   |   |   |   _types.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           _parser.cpython-312.pyc
    |       |   |   |           _re.cpython-312.pyc
    |       |   |   |           _types.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---truststore
    |       |   |   |   |   py.typed
    |       |   |   |   |   _api.py
    |       |   |   |   |   _macos.py
    |       |   |   |   |   _openssl.py
    |       |   |   |   |   _ssl_constants.py
    |       |   |   |   |   _windows.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           _api.cpython-312.pyc
    |       |   |   |           _macos.cpython-312.pyc
    |       |   |   |           _openssl.cpython-312.pyc
    |       |   |   |           _ssl_constants.cpython-312.pyc
    |       |   |   |           _windows.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---urllib3
    |       |   |   |   |   connection.py
    |       |   |   |   |   connectionpool.py
    |       |   |   |   |   exceptions.py
    |       |   |   |   |   fields.py
    |       |   |   |   |   filepost.py
    |       |   |   |   |   poolmanager.py
    |       |   |   |   |   request.py
    |       |   |   |   |   response.py
    |       |   |   |   |   _collections.py
    |       |   |   |   |   _version.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |   +---contrib
    |       |   |   |   |   |   appengine.py
    |       |   |   |   |   |   ntlmpool.py
    |       |   |   |   |   |   pyopenssl.py
    |       |   |   |   |   |   securetransport.py
    |       |   |   |   |   |   socks.py
    |       |   |   |   |   |   _appengine_environ.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |   +---_securetransport
    |       |   |   |   |   |   |   bindings.py
    |       |   |   |   |   |   |   low_level.py
    |       |   |   |   |   |   |   __init__.py
    |       |   |   |   |   |   |   
    |       |   |   |   |   |           bindings.cpython-312.pyc
    |       |   |   |   |   |           low_level.cpython-312.pyc
    |       |   |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |   |           
    |       |   |   |   |           appengine.cpython-312.pyc
    |       |   |   |   |           ntlmpool.cpython-312.pyc
    |       |   |   |   |           pyopenssl.cpython-312.pyc
    |       |   |   |   |           securetransport.cpython-312.pyc
    |       |   |   |   |           socks.cpython-312.pyc
    |       |   |   |   |           _appengine_environ.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---packages
    |       |   |   |   |   |   six.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |   +---backports
    |       |   |   |   |   |   |   makefile.py
    |       |   |   |   |   |   |   weakref_finalize.py
    |       |   |   |   |   |   |   __init__.py
    |       |   |   |   |   |   |   
    |       |   |   |   |   |           makefile.cpython-312.pyc
    |       |   |   |   |   |           weakref_finalize.cpython-312.pyc
    |       |   |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |   |           
    |       |   |   |   |           six.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |   +---util
    |       |   |   |   |   |   connection.py
    |       |   |   |   |   |   proxy.py
    |       |   |   |   |   |   queue.py
    |       |   |   |   |   |   request.py
    |       |   |   |   |   |   response.py
    |       |   |   |   |   |   retry.py
    |       |   |   |   |   |   ssltransport.py
    |       |   |   |   |   |   ssl_.py
    |       |   |   |   |   |   ssl_match_hostname.py
    |       |   |   |   |   |   timeout.py
    |       |   |   |   |   |   url.py
    |       |   |   |   |   |   wait.py
    |       |   |   |   |   |   __init__.py
    |       |   |   |   |   |   
    |       |   |   |   |           connection.cpython-312.pyc
    |       |   |   |   |           proxy.cpython-312.pyc
    |       |   |   |   |           queue.cpython-312.pyc
    |       |   |   |   |           request.cpython-312.pyc
    |       |   |   |   |           response.cpython-312.pyc
    |       |   |   |   |           retry.cpython-312.pyc
    |       |   |   |   |           ssltransport.cpython-312.pyc
    |       |   |   |   |           ssl_.cpython-312.pyc
    |       |   |   |   |           ssl_match_hostname.cpython-312.pyc
    |       |   |   |   |           timeout.cpython-312.pyc
    |       |   |   |   |           url.cpython-312.pyc
    |       |   |   |   |           wait.cpython-312.pyc
    |       |   |   |   |           __init__.cpython-312.pyc
    |       |   |   |   |           
    |       |   |   |           connection.cpython-312.pyc
    |       |   |   |           connectionpool.cpython-312.pyc
    |       |   |   |           exceptions.cpython-312.pyc
    |       |   |   |           fields.cpython-312.pyc
    |       |   |   |           filepost.cpython-312.pyc
    |       |   |   |           poolmanager.cpython-312.pyc
    |       |   |   |           request.cpython-312.pyc
    |       |   |   |           response.cpython-312.pyc
    |       |   |   |           _collections.cpython-312.pyc
    |       |   |   |           _version.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           typing_extensions.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           __init__.cpython-312.pyc
    |       |           __main__.cpython-312.pyc
    |       |           __pip-runner__.cpython-312.pyc
    |       |           
    |       +---pip-24.3.1.dist-info
    |       |       AUTHORS.txt
    |       |       entry_points.txt
    |       |       INSTALLER
    |       |       LICENSE.txt
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       top_level.txt
    |       |       WHEEL
    |       |       
    |       +---psycopg2
    |       |   |   errorcodes.py
    |       |   |   errors.py
    |       |   |   extensions.py
    |       |   |   extras.py
    |       |   |   pool.py
    |       |   |   sql.py
    |       |   |   tz.py
    |       |   |   _ipaddress.py
    |       |   |   _json.py
    |       |   |   _psycopg.cp312-win_amd64.pyd
    |       |   |   _range.py
    |       |   |   __init__.py
    |       |   |   
    |       |           errorcodes.cpython-312.pyc
    |       |           errors.cpython-312.pyc
    |       |           extensions.cpython-312.pyc
    |       |           extras.cpython-312.pyc
    |       |           pool.cpython-312.pyc
    |       |           sql.cpython-312.pyc
    |       |           tz.cpython-312.pyc
    |       |           _ipaddress.cpython-312.pyc
    |       |           _json.cpython-312.pyc
    |       |           _range.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---psycopg2_binary-2.9.11.dist-info
    |       |   |   DELVEWHEEL
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---psycopg2_binary.libs
    |       |       libcrypto-3-x64-51c45f697a173917ac2ce2ccbe4291ee.dll
    |       |       libpq-39ced5d7c01d21795d0b9597d2cf5921.dll
    |       |       libssl-3-x64-d3fc11f8b66f745a6288de6a00662144.dll
    |       |       
    |       +---pyasn1
    |       |   |   debug.py
    |       |   |   error.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---codec
    |       |   |   |   streaming.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---ber
    |       |   |   |   |   decoder.py
    |       |   |   |   |   encoder.py
    |       |   |   |   |   eoo.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           decoder.cpython-312.pyc
    |       |   |   |           encoder.cpython-312.pyc
    |       |   |   |           eoo.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---cer
    |       |   |   |   |   decoder.py
    |       |   |   |   |   encoder.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           decoder.cpython-312.pyc
    |       |   |   |           encoder.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---der
    |       |   |   |   |   decoder.py
    |       |   |   |   |   encoder.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           decoder.cpython-312.pyc
    |       |   |   |           encoder.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---native
    |       |   |   |   |   decoder.py
    |       |   |   |   |   encoder.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           decoder.cpython-312.pyc
    |       |   |   |           encoder.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           streaming.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---compat
    |       |   |   |   integer.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           integer.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---type
    |       |   |   |   base.py
    |       |   |   |   char.py
    |       |   |   |   constraint.py
    |       |   |   |   error.py
    |       |   |   |   namedtype.py
    |       |   |   |   namedval.py
    |       |   |   |   opentype.py
    |       |   |   |   tag.py
    |       |   |   |   tagmap.py
    |       |   |   |   univ.py
    |       |   |   |   useful.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           char.cpython-312.pyc
    |       |   |           constraint.cpython-312.pyc
    |       |   |           error.cpython-312.pyc
    |       |   |           namedtype.cpython-312.pyc
    |       |   |           namedval.cpython-312.pyc
    |       |   |           opentype.cpython-312.pyc
    |       |   |           tag.cpython-312.pyc
    |       |   |           tagmap.cpython-312.pyc
    |       |   |           univ.cpython-312.pyc
    |       |   |           useful.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           debug.cpython-312.pyc
    |       |           error.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---pyasn1-0.6.2.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   zip-safe
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.rst
    |       |           
    |       +---pycparser
    |       |   |   ast_transforms.py
    |       |   |   c_ast.py
    |       |   |   c_generator.py
    |       |   |   c_lexer.py
    |       |   |   c_parser.py
    |       |   |   _ast_gen.py
    |       |   |   _c_ast.cfg
    |       |   |   __init__.py
    |       |   |   
    |       |           ast_transforms.cpython-312.pyc
    |       |           c_ast.cpython-312.pyc
    |       |           c_generator.cpython-312.pyc
    |       |           c_lexer.cpython-312.pyc
    |       |           c_parser.cpython-312.pyc
    |       |           _ast_gen.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---pycparser-3.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---pydantic
    |       |   |   aliases.py
    |       |   |   alias_generators.py
    |       |   |   annotated_handlers.py
    |       |   |   class_validators.py
    |       |   |   color.py
    |       |   |   config.py
    |       |   |   dataclasses.py
    |       |   |   datetime_parse.py
    |       |   |   decorator.py
    |       |   |   env_settings.py
    |       |   |   errors.py
    |       |   |   error_wrappers.py
    |       |   |   fields.py
    |       |   |   functional_serializers.py
    |       |   |   functional_validators.py
    |       |   |   generics.py
    |       |   |   json.py
    |       |   |   json_schema.py
    |       |   |   main.py
    |       |   |   mypy.py
    |       |   |   networks.py
    |       |   |   parse.py
    |       |   |   py.typed
    |       |   |   root_model.py
    |       |   |   schema.py
    |       |   |   tools.py
    |       |   |   types.py
    |       |   |   type_adapter.py
    |       |   |   typing.py
    |       |   |   utils.py
    |       |   |   validate_call_decorator.py
    |       |   |   validators.py
    |       |   |   version.py
    |       |   |   warnings.py
    |       |   |   _migration.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---deprecated
    |       |   |   |   class_validators.py
    |       |   |   |   config.py
    |       |   |   |   copy_internals.py
    |       |   |   |   decorator.py
    |       |   |   |   json.py
    |       |   |   |   parse.py
    |       |   |   |   tools.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           class_validators.cpython-312.pyc
    |       |   |           config.cpython-312.pyc
    |       |   |           copy_internals.cpython-312.pyc
    |       |   |           decorator.cpython-312.pyc
    |       |   |           json.cpython-312.pyc
    |       |   |           parse.cpython-312.pyc
    |       |   |           tools.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---experimental
    |       |   |   |   arguments_schema.py
    |       |   |   |   missing_sentinel.py
    |       |   |   |   pipeline.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           arguments_schema.cpython-312.pyc
    |       |   |           missing_sentinel.cpython-312.pyc
    |       |   |           pipeline.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---plugin
    |       |   |   |   _loader.py
    |       |   |   |   _schema_validator.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _loader.cpython-312.pyc
    |       |   |           _schema_validator.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---v1
    |       |   |   |   annotated_types.py
    |       |   |   |   class_validators.py
    |       |   |   |   color.py
    |       |   |   |   config.py
    |       |   |   |   dataclasses.py
    |       |   |   |   datetime_parse.py
    |       |   |   |   decorator.py
    |       |   |   |   env_settings.py
    |       |   |   |   errors.py
    |       |   |   |   error_wrappers.py
    |       |   |   |   fields.py
    |       |   |   |   generics.py
    |       |   |   |   json.py
    |       |   |   |   main.py
    |       |   |   |   mypy.py
    |       |   |   |   networks.py
    |       |   |   |   parse.py
    |       |   |   |   py.typed
    |       |   |   |   schema.py
    |       |   |   |   tools.py
    |       |   |   |   types.py
    |       |   |   |   typing.py
    |       |   |   |   utils.py
    |       |   |   |   validators.py
    |       |   |   |   version.py
    |       |   |   |   _hypothesis_plugin.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           annotated_types.cpython-312.pyc
    |       |   |           class_validators.cpython-312.pyc
    |       |   |           color.cpython-312.pyc
    |       |   |           config.cpython-312.pyc
    |       |   |           dataclasses.cpython-312.pyc
    |       |   |           datetime_parse.cpython-312.pyc
    |       |   |           decorator.cpython-312.pyc
    |       |   |           env_settings.cpython-312.pyc
    |       |   |           errors.cpython-312.pyc
    |       |   |           error_wrappers.cpython-312.pyc
    |       |   |           fields.cpython-312.pyc
    |       |   |           generics.cpython-312.pyc
    |       |   |           json.cpython-312.pyc
    |       |   |           main.cpython-312.pyc
    |       |   |           mypy.cpython-312.pyc
    |       |   |           networks.cpython-312.pyc
    |       |   |           parse.cpython-312.pyc
    |       |   |           schema.cpython-312.pyc
    |       |   |           tools.cpython-312.pyc
    |       |   |           types.cpython-312.pyc
    |       |   |           typing.cpython-312.pyc
    |       |   |           utils.cpython-312.pyc
    |       |   |           validators.cpython-312.pyc
    |       |   |           version.cpython-312.pyc
    |       |   |           _hypothesis_plugin.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---_internal
    |       |   |   |   _config.py
    |       |   |   |   _core_metadata.py
    |       |   |   |   _core_utils.py
    |       |   |   |   _dataclasses.py
    |       |   |   |   _decorators.py
    |       |   |   |   _decorators_v1.py
    |       |   |   |   _discriminated_union.py
    |       |   |   |   _docs_extraction.py
    |       |   |   |   _fields.py
    |       |   |   |   _forward_ref.py
    |       |   |   |   _generate_schema.py
    |       |   |   |   _generics.py
    |       |   |   |   _git.py
    |       |   |   |   _import_utils.py
    |       |   |   |   _internal_dataclass.py
    |       |   |   |   _known_annotated_metadata.py
    |       |   |   |   _mock_val_ser.py
    |       |   |   |   _model_construction.py
    |       |   |   |   _namespace_utils.py
    |       |   |   |   _repr.py
    |       |   |   |   _schema_gather.py
    |       |   |   |   _schema_generation_shared.py
    |       |   |   |   _serializers.py
    |       |   |   |   _signature.py
    |       |   |   |   _typing_extra.py
    |       |   |   |   _utils.py
    |       |   |   |   _validate_call.py
    |       |   |   |   _validators.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           _config.cpython-312.pyc
    |       |   |           _core_metadata.cpython-312.pyc
    |       |   |           _core_utils.cpython-312.pyc
    |       |   |           _dataclasses.cpython-312.pyc
    |       |   |           _decorators.cpython-312.pyc
    |       |   |           _decorators_v1.cpython-312.pyc
    |       |   |           _discriminated_union.cpython-312.pyc
    |       |   |           _docs_extraction.cpython-312.pyc
    |       |   |           _fields.cpython-312.pyc
    |       |   |           _forward_ref.cpython-312.pyc
    |       |   |           _generate_schema.cpython-312.pyc
    |       |   |           _generics.cpython-312.pyc
    |       |   |           _git.cpython-312.pyc
    |       |   |           _import_utils.cpython-312.pyc
    |       |   |           _internal_dataclass.cpython-312.pyc
    |       |   |           _known_annotated_metadata.cpython-312.pyc
    |       |   |           _mock_val_ser.cpython-312.pyc
    |       |   |           _model_construction.cpython-312.pyc
    |       |   |           _namespace_utils.cpython-312.pyc
    |       |   |           _repr.cpython-312.pyc
    |       |   |           _schema_gather.cpython-312.pyc
    |       |   |           _schema_generation_shared.cpython-312.pyc
    |       |   |           _serializers.cpython-312.pyc
    |       |   |           _signature.cpython-312.pyc
    |       |   |           _typing_extra.cpython-312.pyc
    |       |   |           _utils.cpython-312.pyc
    |       |   |           _validate_call.cpython-312.pyc
    |       |   |           _validators.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           aliases.cpython-312.pyc
    |       |           alias_generators.cpython-312.pyc
    |       |           annotated_handlers.cpython-312.pyc
    |       |           class_validators.cpython-312.pyc
    |       |           color.cpython-312.pyc
    |       |           config.cpython-312.pyc
    |       |           dataclasses.cpython-312.pyc
    |       |           datetime_parse.cpython-312.pyc
    |       |           decorator.cpython-312.pyc
    |       |           env_settings.cpython-312.pyc
    |       |           errors.cpython-312.pyc
    |       |           error_wrappers.cpython-312.pyc
    |       |           fields.cpython-312.pyc
    |       |           functional_serializers.cpython-312.pyc
    |       |           functional_validators.cpython-312.pyc
    |       |           generics.cpython-312.pyc
    |       |           json.cpython-312.pyc
    |       |           json_schema.cpython-312.pyc
    |       |           main.cpython-312.pyc
    |       |           mypy.cpython-312.pyc
    |       |           networks.cpython-312.pyc
    |       |           parse.cpython-312.pyc
    |       |           root_model.cpython-312.pyc
    |       |           schema.cpython-312.pyc
    |       |           tools.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           type_adapter.cpython-312.pyc
    |       |           typing.cpython-312.pyc
    |       |           utils.cpython-312.pyc
    |       |           validate_call_decorator.cpython-312.pyc
    |       |           validators.cpython-312.pyc
    |       |           version.cpython-312.pyc
    |       |           warnings.cpython-312.pyc
    |       |           _migration.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---pydantic-2.12.5.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---pydantic_core
    |       |   |   core_schema.py
    |       |   |   py.typed
    |       |   |   _pydantic_core.cp312-win_amd64.pyd
    |       |   |   _pydantic_core.pyi
    |       |   |   __init__.py
    |       |   |   
    |       |           core_schema.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---pydantic_core-2.41.5.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---python_dotenv-1.2.1.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---python_jose-3.5.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---python_multipart
    |       |   |   decoders.py
    |       |   |   exceptions.py
    |       |   |   multipart.py
    |       |   |   py.typed
    |       |   |   __init__.py
    |       |   |   
    |       |           decoders.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           multipart.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---python_multipart-0.0.22.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.txt
    |       |           
    |       +---rsa
    |       |   |   asn1.py
    |       |   |   cli.py
    |       |   |   common.py
    |       |   |   core.py
    |       |   |   key.py
    |       |   |   parallel.py
    |       |   |   pem.py
    |       |   |   pkcs1.py
    |       |   |   pkcs1_v2.py
    |       |   |   prime.py
    |       |   |   py.typed
    |       |   |   randnum.py
    |       |   |   transform.py
    |       |   |   util.py
    |       |   |   __init__.py
    |       |   |   
    |       |           asn1.cpython-312.pyc
    |       |           cli.cpython-312.pyc
    |       |           common.cpython-312.pyc
    |       |           core.cpython-312.pyc
    |       |           key.cpython-312.pyc
    |       |           parallel.cpython-312.pyc
    |       |           pem.cpython-312.pyc
    |       |           pkcs1.cpython-312.pyc
    |       |           pkcs1_v2.cpython-312.pyc
    |       |           prime.cpython-312.pyc
    |       |           randnum.cpython-312.pyc
    |       |           transform.cpython-312.pyc
    |       |           util.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---rsa-4.9.1.dist-info
    |       |       entry_points.txt
    |       |       INSTALLER
    |       |       LICENSE
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       WHEEL
    |       |       
    |       +---six-1.17.0.dist-info
    |       |       INSTALLER
    |       |       LICENSE
    |       |       METADATA
    |       |       RECORD
    |       |       REQUESTED
    |       |       top_level.txt
    |       |       WHEEL
    |       |       
    |       +---sqlalchemy
    |       |   |   events.py
    |       |   |   exc.py
    |       |   |   inspection.py
    |       |   |   log.py
    |       |   |   py.typed
    |       |   |   schema.py
    |       |   |   types.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---connectors
    |       |   |   |   aioodbc.py
    |       |   |   |   asyncio.py
    |       |   |   |   pyodbc.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           aioodbc.cpython-312.pyc
    |       |   |           asyncio.cpython-312.pyc
    |       |   |           pyodbc.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---cyextension
    |       |   |   |   collections.cp312-win_amd64.pyd
    |       |   |   |   collections.pyx
    |       |   |   |   immutabledict.cp312-win_amd64.pyd
    |       |   |   |   immutabledict.pxd
    |       |   |   |   immutabledict.pyx
    |       |   |   |   processors.cp312-win_amd64.pyd
    |       |   |   |   processors.pyx
    |       |   |   |   resultproxy.cp312-win_amd64.pyd
    |       |   |   |   resultproxy.pyx
    |       |   |   |   util.cp312-win_amd64.pyd
    |       |   |   |   util.pyx
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---dialects
    |       |   |   |   type_migration_guidelines.txt
    |       |   |   |   _typing.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---mssql
    |       |   |   |   |   aioodbc.py
    |       |   |   |   |   base.py
    |       |   |   |   |   information_schema.py
    |       |   |   |   |   json.py
    |       |   |   |   |   provision.py
    |       |   |   |   |   pymssql.py
    |       |   |   |   |   pyodbc.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           aioodbc.cpython-312.pyc
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           information_schema.cpython-312.pyc
    |       |   |   |           json.cpython-312.pyc
    |       |   |   |           provision.cpython-312.pyc
    |       |   |   |           pymssql.cpython-312.pyc
    |       |   |   |           pyodbc.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---mysql
    |       |   |   |   |   aiomysql.py
    |       |   |   |   |   asyncmy.py
    |       |   |   |   |   base.py
    |       |   |   |   |   cymysql.py
    |       |   |   |   |   dml.py
    |       |   |   |   |   enumerated.py
    |       |   |   |   |   expression.py
    |       |   |   |   |   json.py
    |       |   |   |   |   mariadb.py
    |       |   |   |   |   mariadbconnector.py
    |       |   |   |   |   mysqlconnector.py
    |       |   |   |   |   mysqldb.py
    |       |   |   |   |   provision.py
    |       |   |   |   |   pymysql.py
    |       |   |   |   |   pyodbc.py
    |       |   |   |   |   reflection.py
    |       |   |   |   |   reserved_words.py
    |       |   |   |   |   types.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           aiomysql.cpython-312.pyc
    |       |   |   |           asyncmy.cpython-312.pyc
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           cymysql.cpython-312.pyc
    |       |   |   |           dml.cpython-312.pyc
    |       |   |   |           enumerated.cpython-312.pyc
    |       |   |   |           expression.cpython-312.pyc
    |       |   |   |           json.cpython-312.pyc
    |       |   |   |           mariadb.cpython-312.pyc
    |       |   |   |           mariadbconnector.cpython-312.pyc
    |       |   |   |           mysqlconnector.cpython-312.pyc
    |       |   |   |           mysqldb.cpython-312.pyc
    |       |   |   |           provision.cpython-312.pyc
    |       |   |   |           pymysql.cpython-312.pyc
    |       |   |   |           pyodbc.cpython-312.pyc
    |       |   |   |           reflection.cpython-312.pyc
    |       |   |   |           reserved_words.cpython-312.pyc
    |       |   |   |           types.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---oracle
    |       |   |   |   |   base.py
    |       |   |   |   |   cx_oracle.py
    |       |   |   |   |   dictionary.py
    |       |   |   |   |   oracledb.py
    |       |   |   |   |   provision.py
    |       |   |   |   |   types.py
    |       |   |   |   |   vector.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           cx_oracle.cpython-312.pyc
    |       |   |   |           dictionary.cpython-312.pyc
    |       |   |   |           oracledb.cpython-312.pyc
    |       |   |   |           provision.cpython-312.pyc
    |       |   |   |           types.cpython-312.pyc
    |       |   |   |           vector.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---postgresql
    |       |   |   |   |   array.py
    |       |   |   |   |   asyncpg.py
    |       |   |   |   |   base.py
    |       |   |   |   |   dml.py
    |       |   |   |   |   ext.py
    |       |   |   |   |   hstore.py
    |       |   |   |   |   json.py
    |       |   |   |   |   named_types.py
    |       |   |   |   |   operators.py
    |       |   |   |   |   pg8000.py
    |       |   |   |   |   pg_catalog.py
    |       |   |   |   |   provision.py
    |       |   |   |   |   psycopg.py
    |       |   |   |   |   psycopg2.py
    |       |   |   |   |   psycopg2cffi.py
    |       |   |   |   |   ranges.py
    |       |   |   |   |   types.py
    |       |   |   |   |   _psycopg_common.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           array.cpython-312.pyc
    |       |   |   |           asyncpg.cpython-312.pyc
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           dml.cpython-312.pyc
    |       |   |   |           ext.cpython-312.pyc
    |       |   |   |           hstore.cpython-312.pyc
    |       |   |   |           json.cpython-312.pyc
    |       |   |   |           named_types.cpython-312.pyc
    |       |   |   |           operators.cpython-312.pyc
    |       |   |   |           pg8000.cpython-312.pyc
    |       |   |   |           pg_catalog.cpython-312.pyc
    |       |   |   |           provision.cpython-312.pyc
    |       |   |   |           psycopg.cpython-312.pyc
    |       |   |   |           psycopg2.cpython-312.pyc
    |       |   |   |           psycopg2cffi.cpython-312.pyc
    |       |   |   |           ranges.cpython-312.pyc
    |       |   |   |           types.cpython-312.pyc
    |       |   |   |           _psycopg_common.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---sqlite
    |       |   |   |   |   aiosqlite.py
    |       |   |   |   |   base.py
    |       |   |   |   |   dml.py
    |       |   |   |   |   json.py
    |       |   |   |   |   provision.py
    |       |   |   |   |   pysqlcipher.py
    |       |   |   |   |   pysqlite.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           aiosqlite.cpython-312.pyc
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           dml.cpython-312.pyc
    |       |   |   |           json.cpython-312.pyc
    |       |   |   |           provision.cpython-312.pyc
    |       |   |   |           pysqlcipher.cpython-312.pyc
    |       |   |   |           pysqlite.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           _typing.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---engine
    |       |   |   |   base.py
    |       |   |   |   characteristics.py
    |       |   |   |   create.py
    |       |   |   |   cursor.py
    |       |   |   |   default.py
    |       |   |   |   events.py
    |       |   |   |   interfaces.py
    |       |   |   |   mock.py
    |       |   |   |   processors.py
    |       |   |   |   reflection.py
    |       |   |   |   result.py
    |       |   |   |   row.py
    |       |   |   |   strategies.py
    |       |   |   |   url.py
    |       |   |   |   util.py
    |       |   |   |   _py_processors.py
    |       |   |   |   _py_row.py
    |       |   |   |   _py_util.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           characteristics.cpython-312.pyc
    |       |   |           create.cpython-312.pyc
    |       |   |           cursor.cpython-312.pyc
    |       |   |           default.cpython-312.pyc
    |       |   |           events.cpython-312.pyc
    |       |   |           interfaces.cpython-312.pyc
    |       |   |           mock.cpython-312.pyc
    |       |   |           processors.cpython-312.pyc
    |       |   |           reflection.cpython-312.pyc
    |       |   |           result.cpython-312.pyc
    |       |   |           row.cpython-312.pyc
    |       |   |           strategies.cpython-312.pyc
    |       |   |           url.cpython-312.pyc
    |       |   |           util.cpython-312.pyc
    |       |   |           _py_processors.cpython-312.pyc
    |       |   |           _py_row.cpython-312.pyc
    |       |   |           _py_util.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---event
    |       |   |   |   api.py
    |       |   |   |   attr.py
    |       |   |   |   base.py
    |       |   |   |   legacy.py
    |       |   |   |   registry.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           api.cpython-312.pyc
    |       |   |           attr.cpython-312.pyc
    |       |   |           base.cpython-312.pyc
    |       |   |           legacy.cpython-312.pyc
    |       |   |           registry.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---ext
    |       |   |   |   associationproxy.py
    |       |   |   |   automap.py
    |       |   |   |   baked.py
    |       |   |   |   compiler.py
    |       |   |   |   horizontal_shard.py
    |       |   |   |   hybrid.py
    |       |   |   |   indexable.py
    |       |   |   |   instrumentation.py
    |       |   |   |   mutable.py
    |       |   |   |   orderinglist.py
    |       |   |   |   serializer.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---asyncio
    |       |   |   |   |   base.py
    |       |   |   |   |   engine.py
    |       |   |   |   |   exc.py
    |       |   |   |   |   result.py
    |       |   |   |   |   scoping.py
    |       |   |   |   |   session.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           engine.cpython-312.pyc
    |       |   |   |           exc.cpython-312.pyc
    |       |   |   |           result.cpython-312.pyc
    |       |   |   |           scoping.cpython-312.pyc
    |       |   |   |           session.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---declarative
    |       |   |   |   |   extensions.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           extensions.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---mypy
    |       |   |   |   |   apply.py
    |       |   |   |   |   decl_class.py
    |       |   |   |   |   infer.py
    |       |   |   |   |   names.py
    |       |   |   |   |   plugin.py
    |       |   |   |   |   util.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           apply.cpython-312.pyc
    |       |   |   |           decl_class.cpython-312.pyc
    |       |   |   |           infer.cpython-312.pyc
    |       |   |   |           names.cpython-312.pyc
    |       |   |   |           plugin.cpython-312.pyc
    |       |   |   |           util.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           associationproxy.cpython-312.pyc
    |       |   |           automap.cpython-312.pyc
    |       |   |           baked.cpython-312.pyc
    |       |   |           compiler.cpython-312.pyc
    |       |   |           horizontal_shard.cpython-312.pyc
    |       |   |           hybrid.cpython-312.pyc
    |       |   |           indexable.cpython-312.pyc
    |       |   |           instrumentation.cpython-312.pyc
    |       |   |           mutable.cpython-312.pyc
    |       |   |           orderinglist.cpython-312.pyc
    |       |   |           serializer.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---future
    |       |   |   |   engine.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           engine.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---orm
    |       |   |   |   attributes.py
    |       |   |   |   base.py
    |       |   |   |   bulk_persistence.py
    |       |   |   |   clsregistry.py
    |       |   |   |   collections.py
    |       |   |   |   context.py
    |       |   |   |   decl_api.py
    |       |   |   |   decl_base.py
    |       |   |   |   dependency.py
    |       |   |   |   descriptor_props.py
    |       |   |   |   dynamic.py
    |       |   |   |   evaluator.py
    |       |   |   |   events.py
    |       |   |   |   exc.py
    |       |   |   |   identity.py
    |       |   |   |   instrumentation.py
    |       |   |   |   interfaces.py
    |       |   |   |   loading.py
    |       |   |   |   mapped_collection.py
    |       |   |   |   mapper.py
    |       |   |   |   path_registry.py
    |       |   |   |   persistence.py
    |       |   |   |   properties.py
    |       |   |   |   query.py
    |       |   |   |   relationships.py
    |       |   |   |   scoping.py
    |       |   |   |   session.py
    |       |   |   |   state.py
    |       |   |   |   state_changes.py
    |       |   |   |   strategies.py
    |       |   |   |   strategy_options.py
    |       |   |   |   sync.py
    |       |   |   |   unitofwork.py
    |       |   |   |   util.py
    |       |   |   |   writeonly.py
    |       |   |   |   _orm_constructors.py
    |       |   |   |   _typing.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           attributes.cpython-312.pyc
    |       |   |           base.cpython-312.pyc
    |       |   |           bulk_persistence.cpython-312.pyc
    |       |   |           clsregistry.cpython-312.pyc
    |       |   |           collections.cpython-312.pyc
    |       |   |           context.cpython-312.pyc
    |       |   |           decl_api.cpython-312.pyc
    |       |   |           decl_base.cpython-312.pyc
    |       |   |           dependency.cpython-312.pyc
    |       |   |           descriptor_props.cpython-312.pyc
    |       |   |           dynamic.cpython-312.pyc
    |       |   |           evaluator.cpython-312.pyc
    |       |   |           events.cpython-312.pyc
    |       |   |           exc.cpython-312.pyc
    |       |   |           identity.cpython-312.pyc
    |       |   |           instrumentation.cpython-312.pyc
    |       |   |           interfaces.cpython-312.pyc
    |       |   |           loading.cpython-312.pyc
    |       |   |           mapped_collection.cpython-312.pyc
    |       |   |           mapper.cpython-312.pyc
    |       |   |           path_registry.cpython-312.pyc
    |       |   |           persistence.cpython-312.pyc
    |       |   |           properties.cpython-312.pyc
    |       |   |           query.cpython-312.pyc
    |       |   |           relationships.cpython-312.pyc
    |       |   |           scoping.cpython-312.pyc
    |       |   |           session.cpython-312.pyc
    |       |   |           state.cpython-312.pyc
    |       |   |           state_changes.cpython-312.pyc
    |       |   |           strategies.cpython-312.pyc
    |       |   |           strategy_options.cpython-312.pyc
    |       |   |           sync.cpython-312.pyc
    |       |   |           unitofwork.cpython-312.pyc
    |       |   |           util.cpython-312.pyc
    |       |   |           writeonly.cpython-312.pyc
    |       |   |           _orm_constructors.cpython-312.pyc
    |       |   |           _typing.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---pool
    |       |   |   |   base.py
    |       |   |   |   events.py
    |       |   |   |   impl.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           base.cpython-312.pyc
    |       |   |           events.cpython-312.pyc
    |       |   |           impl.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---sql
    |       |   |   |   annotation.py
    |       |   |   |   base.py
    |       |   |   |   cache_key.py
    |       |   |   |   coercions.py
    |       |   |   |   compiler.py
    |       |   |   |   crud.py
    |       |   |   |   ddl.py
    |       |   |   |   default_comparator.py
    |       |   |   |   dml.py
    |       |   |   |   elements.py
    |       |   |   |   events.py
    |       |   |   |   expression.py
    |       |   |   |   functions.py
    |       |   |   |   lambdas.py
    |       |   |   |   naming.py
    |       |   |   |   operators.py
    |       |   |   |   roles.py
    |       |   |   |   schema.py
    |       |   |   |   selectable.py
    |       |   |   |   sqltypes.py
    |       |   |   |   traversals.py
    |       |   |   |   type_api.py
    |       |   |   |   util.py
    |       |   |   |   visitors.py
    |       |   |   |   _dml_constructors.py
    |       |   |   |   _elements_constructors.py
    |       |   |   |   _orm_types.py
    |       |   |   |   _py_util.py
    |       |   |   |   _selectable_constructors.py
    |       |   |   |   _typing.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           annotation.cpython-312.pyc
    |       |   |           base.cpython-312.pyc
    |       |   |           cache_key.cpython-312.pyc
    |       |   |           coercions.cpython-312.pyc
    |       |   |           compiler.cpython-312.pyc
    |       |   |           crud.cpython-312.pyc
    |       |   |           ddl.cpython-312.pyc
    |       |   |           default_comparator.cpython-312.pyc
    |       |   |           dml.cpython-312.pyc
    |       |   |           elements.cpython-312.pyc
    |       |   |           events.cpython-312.pyc
    |       |   |           expression.cpython-312.pyc
    |       |   |           functions.cpython-312.pyc
    |       |   |           lambdas.cpython-312.pyc
    |       |   |           naming.cpython-312.pyc
    |       |   |           operators.cpython-312.pyc
    |       |   |           roles.cpython-312.pyc
    |       |   |           schema.cpython-312.pyc
    |       |   |           selectable.cpython-312.pyc
    |       |   |           sqltypes.cpython-312.pyc
    |       |   |           traversals.cpython-312.pyc
    |       |   |           type_api.cpython-312.pyc
    |       |   |           util.cpython-312.pyc
    |       |   |           visitors.cpython-312.pyc
    |       |   |           _dml_constructors.cpython-312.pyc
    |       |   |           _elements_constructors.cpython-312.pyc
    |       |   |           _orm_types.cpython-312.pyc
    |       |   |           _py_util.cpython-312.pyc
    |       |   |           _selectable_constructors.cpython-312.pyc
    |       |   |           _typing.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---testing
    |       |   |   |   assertions.py
    |       |   |   |   assertsql.py
    |       |   |   |   asyncio.py
    |       |   |   |   config.py
    |       |   |   |   engines.py
    |       |   |   |   entities.py
    |       |   |   |   exclusions.py
    |       |   |   |   pickleable.py
    |       |   |   |   profiling.py
    |       |   |   |   provision.py
    |       |   |   |   requirements.py
    |       |   |   |   schema.py
    |       |   |   |   util.py
    |       |   |   |   warnings.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---fixtures
    |       |   |   |   |   base.py
    |       |   |   |   |   mypy.py
    |       |   |   |   |   orm.py
    |       |   |   |   |   sql.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           base.cpython-312.pyc
    |       |   |   |           mypy.cpython-312.pyc
    |       |   |   |           orm.cpython-312.pyc
    |       |   |   |           sql.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---plugin
    |       |   |   |   |   bootstrap.py
    |       |   |   |   |   plugin_base.py
    |       |   |   |   |   pytestplugin.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           bootstrap.cpython-312.pyc
    |       |   |   |           plugin_base.cpython-312.pyc
    |       |   |   |           pytestplugin.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---suite
    |       |   |   |   |   test_cte.py
    |       |   |   |   |   test_ddl.py
    |       |   |   |   |   test_deprecations.py
    |       |   |   |   |   test_dialect.py
    |       |   |   |   |   test_insert.py
    |       |   |   |   |   test_reflection.py
    |       |   |   |   |   test_results.py
    |       |   |   |   |   test_rowcount.py
    |       |   |   |   |   test_select.py
    |       |   |   |   |   test_sequence.py
    |       |   |   |   |   test_types.py
    |       |   |   |   |   test_unicode_ddl.py
    |       |   |   |   |   test_update_delete.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           test_cte.cpython-312.pyc
    |       |   |   |           test_ddl.cpython-312.pyc
    |       |   |   |           test_deprecations.cpython-312.pyc
    |       |   |   |           test_dialect.cpython-312.pyc
    |       |   |   |           test_insert.cpython-312.pyc
    |       |   |   |           test_reflection.cpython-312.pyc
    |       |   |   |           test_results.cpython-312.pyc
    |       |   |   |           test_rowcount.cpython-312.pyc
    |       |   |   |           test_select.cpython-312.pyc
    |       |   |   |           test_sequence.cpython-312.pyc
    |       |   |   |           test_types.cpython-312.pyc
    |       |   |   |           test_unicode_ddl.cpython-312.pyc
    |       |   |   |           test_update_delete.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           assertions.cpython-312.pyc
    |       |   |           assertsql.cpython-312.pyc
    |       |   |           asyncio.cpython-312.pyc
    |       |   |           config.cpython-312.pyc
    |       |   |           engines.cpython-312.pyc
    |       |   |           entities.cpython-312.pyc
    |       |   |           exclusions.cpython-312.pyc
    |       |   |           pickleable.cpython-312.pyc
    |       |   |           profiling.cpython-312.pyc
    |       |   |           provision.cpython-312.pyc
    |       |   |           requirements.cpython-312.pyc
    |       |   |           schema.cpython-312.pyc
    |       |   |           util.cpython-312.pyc
    |       |   |           warnings.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---util
    |       |   |   |   compat.py
    |       |   |   |   concurrency.py
    |       |   |   |   deprecations.py
    |       |   |   |   langhelpers.py
    |       |   |   |   preloaded.py
    |       |   |   |   queue.py
    |       |   |   |   tool_support.py
    |       |   |   |   topological.py
    |       |   |   |   typing.py
    |       |   |   |   _collections.py
    |       |   |   |   _concurrency_py3k.py
    |       |   |   |   _has_cy.py
    |       |   |   |   _py_collections.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           compat.cpython-312.pyc
    |       |   |           concurrency.cpython-312.pyc
    |       |   |           deprecations.cpython-312.pyc
    |       |   |           langhelpers.cpython-312.pyc
    |       |   |           preloaded.cpython-312.pyc
    |       |   |           queue.cpython-312.pyc
    |       |   |           tool_support.cpython-312.pyc
    |       |   |           topological.cpython-312.pyc
    |       |   |           typing.cpython-312.pyc
    |       |   |           _collections.cpython-312.pyc
    |       |   |           _concurrency_py3k.cpython-312.pyc
    |       |   |           _has_cy.cpython-312.pyc
    |       |   |           _py_collections.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           events.cpython-312.pyc
    |       |           exc.cpython-312.pyc
    |       |           inspection.cpython-312.pyc
    |       |           log.cpython-312.pyc
    |       |           schema.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---sqlalchemy-2.0.46.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   top_level.txt
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---starlette
    |       |   |   applications.py
    |       |   |   authentication.py
    |       |   |   background.py
    |       |   |   concurrency.py
    |       |   |   config.py
    |       |   |   convertors.py
    |       |   |   datastructures.py
    |       |   |   endpoints.py
    |       |   |   exceptions.py
    |       |   |   formparsers.py
    |       |   |   py.typed
    |       |   |   requests.py
    |       |   |   responses.py
    |       |   |   routing.py
    |       |   |   schemas.py
    |       |   |   staticfiles.py
    |       |   |   status.py
    |       |   |   templating.py
    |       |   |   testclient.py
    |       |   |   types.py
    |       |   |   websockets.py
    |       |   |   _exception_handler.py
    |       |   |   _utils.py
    |       |   |   __init__.py
    |       |   |   
    |       |   +---middleware
    |       |   |   |   authentication.py
    |       |   |   |   base.py
    |       |   |   |   cors.py
    |       |   |   |   errors.py
    |       |   |   |   exceptions.py
    |       |   |   |   gzip.py
    |       |   |   |   httpsredirect.py
    |       |   |   |   sessions.py
    |       |   |   |   trustedhost.py
    |       |   |   |   wsgi.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           authentication.cpython-312.pyc
    |       |   |           base.cpython-312.pyc
    |       |   |           cors.cpython-312.pyc
    |       |   |           errors.cpython-312.pyc
    |       |   |           exceptions.cpython-312.pyc
    |       |   |           gzip.cpython-312.pyc
    |       |   |           httpsredirect.cpython-312.pyc
    |       |   |           sessions.cpython-312.pyc
    |       |   |           trustedhost.cpython-312.pyc
    |       |   |           wsgi.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           applications.cpython-312.pyc
    |       |           authentication.cpython-312.pyc
    |       |           background.cpython-312.pyc
    |       |           concurrency.cpython-312.pyc
    |       |           config.cpython-312.pyc
    |       |           convertors.cpython-312.pyc
    |       |           datastructures.cpython-312.pyc
    |       |           endpoints.cpython-312.pyc
    |       |           exceptions.cpython-312.pyc
    |       |           formparsers.cpython-312.pyc
    |       |           requests.cpython-312.pyc
    |       |           responses.cpython-312.pyc
    |       |           routing.cpython-312.pyc
    |       |           schemas.cpython-312.pyc
    |       |           staticfiles.cpython-312.pyc
    |       |           status.cpython-312.pyc
    |       |           templating.cpython-312.pyc
    |       |           testclient.cpython-312.pyc
    |       |           types.cpython-312.pyc
    |       |           websockets.cpython-312.pyc
    |       |           _exception_handler.cpython-312.pyc
    |       |           _utils.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---starlette-0.52.1.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.md
    |       |           
    |       +---typing_extensions-4.15.0.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---typing_inspection
    |       |   |   introspection.py
    |       |   |   py.typed
    |       |   |   typing_objects.py
    |       |   |   typing_objects.pyi
    |       |   |   __init__.py
    |       |   |   
    |       |           introspection.cpython-312.pyc
    |       |           typing_objects.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           
    |       +---typing_inspection-0.4.2.dist-info
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE
    |       |           
    |       +---uvicorn
    |       |   |   config.py
    |       |   |   importer.py
    |       |   |   logging.py
    |       |   |   main.py
    |       |   |   py.typed
    |       |   |   server.py
    |       |   |   workers.py
    |       |   |   _compat.py
    |       |   |   _subprocess.py
    |       |   |   _types.py
    |       |   |   __init__.py
    |       |   |   __main__.py
    |       |   |   
    |       |   +---lifespan
    |       |   |   |   off.py
    |       |   |   |   on.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           off.cpython-312.pyc
    |       |   |           on.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---loops
    |       |   |   |   asyncio.py
    |       |   |   |   auto.py
    |       |   |   |   uvloop.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           asyncio.cpython-312.pyc
    |       |   |           auto.cpython-312.pyc
    |       |   |           uvloop.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---middleware
    |       |   |   |   asgi2.py
    |       |   |   |   message_logger.py
    |       |   |   |   proxy_headers.py
    |       |   |   |   wsgi.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           asgi2.cpython-312.pyc
    |       |   |           message_logger.cpython-312.pyc
    |       |   |           proxy_headers.cpython-312.pyc
    |       |   |           wsgi.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---protocols
    |       |   |   |   utils.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |   +---http
    |       |   |   |   |   auto.py
    |       |   |   |   |   flow_control.py
    |       |   |   |   |   h11_impl.py
    |       |   |   |   |   httptools_impl.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           auto.cpython-312.pyc
    |       |   |   |           flow_control.cpython-312.pyc
    |       |   |   |           h11_impl.cpython-312.pyc
    |       |   |   |           httptools_impl.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |   +---websockets
    |       |   |   |   |   auto.py
    |       |   |   |   |   websockets_impl.py
    |       |   |   |   |   websockets_sansio_impl.py
    |       |   |   |   |   wsproto_impl.py
    |       |   |   |   |   __init__.py
    |       |   |   |   |   
    |       |   |   |           auto.cpython-312.pyc
    |       |   |   |           websockets_impl.cpython-312.pyc
    |       |   |   |           websockets_sansio_impl.cpython-312.pyc
    |       |   |   |           wsproto_impl.cpython-312.pyc
    |       |   |   |           __init__.cpython-312.pyc
    |       |   |   |           
    |       |   |           utils.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |   +---supervisors
    |       |   |   |   basereload.py
    |       |   |   |   multiprocess.py
    |       |   |   |   statreload.py
    |       |   |   |   watchfilesreload.py
    |       |   |   |   __init__.py
    |       |   |   |   
    |       |   |           basereload.cpython-312.pyc
    |       |   |           multiprocess.cpython-312.pyc
    |       |   |           statreload.cpython-312.pyc
    |       |   |           watchfilesreload.cpython-312.pyc
    |       |   |           __init__.cpython-312.pyc
    |       |   |           
    |       |           config.cpython-312.pyc
    |       |           importer.cpython-312.pyc
    |       |           logging.cpython-312.pyc
    |       |           main.cpython-312.pyc
    |       |           server.cpython-312.pyc
    |       |           workers.cpython-312.pyc
    |       |           _compat.cpython-312.pyc
    |       |           _subprocess.cpython-312.pyc
    |       |           _types.cpython-312.pyc
    |       |           __init__.cpython-312.pyc
    |       |           __main__.cpython-312.pyc
    |       |           
    |       +---uvicorn-0.41.0.dist-info
    |       |   |   entry_points.txt
    |       |   |   INSTALLER
    |       |   |   METADATA
    |       |   |   RECORD
    |       |   |   REQUESTED
    |       |   |   WHEEL
    |       |   |   
    |       |   \---licenses
    |       |           LICENSE.md
    |       |           
    |               six.cpython-312.pyc
    |               typing_extensions.cpython-312.pyc
    |               
    \---Scripts
            activate
            activate.bat
            Activate.ps1
            deactivate.bat
            dotenv.exe
            email_validator.exe
            f2py.exe
            fastapi.exe
            numpy-config.exe
            pip.exe
            pip3.12.exe
            pip3.exe
            pyrsa-decrypt.exe
            pyrsa-encrypt.exe
            pyrsa-keygen.exe
            pyrsa-priv2pub.exe
            pyrsa-sign.exe
            pyrsa-verify.exe
            python.exe
            pythonw.exe
            uvicorn.exe
            
